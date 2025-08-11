// pages/api/openai.js
import { supabaseAdmin } from '../../lib/supabaseAdmin'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const RATE_LIMIT = 10 // requests
const RATE_WINDOW_MS = 60 * 1000 // 60 seconds

async function getUserFromToken(token) {
  const url = `${SUPABASE_URL}/auth/v1/user`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return null
  return res.json()
}

async function checkRateLimit(userId, ip) {
  // count entries for this user in last RATE_WINDOW_MS
  const cutoff = new Date(Date.now() - RATE_WINDOW_MS).toISOString()
  const { data } = await supabaseAdmin
    .from('ai_requests')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .gt('created_at', cutoff)
  const count = (data && data.length) || 0
  return count < RATE_LIMIT
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const authHeader = req.headers.authorization || ''
  const token = authHeader.split('Bearer ')[1]
  if (!token) return res.status(401).json({ error: 'Missing token' })

  // get user
  const user = await getUserFromToken(token)
  if (!user?.id) return res.status(401).json({ error: 'Invalid token' })

  // rate limit
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const ok = await checkRateLimit(user.id, ip)
  if (!ok) return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' })

  const userMessage = (req.body?.message || '').toString().slice(0, 2000)
  if (!userMessage) return res.status(400).json({ error: 'Message required' })

  // moderation check
  try {
    const modRes = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({ input: userMessage, model: 'omni-moderation-latest' })
    })
    const modJson = await modRes.json()
    const flagged = modJson?.results?.[0]?.categories?.sexual || modJson?.results?.[0]?.flagged
    if (flagged) {
      return res.status(403).json({ error: 'Message violates content policy.' })
    }
  } catch (e) {
    console.error('moderation error', e)
    // continue cautiously
  }

  // record request (for rate limiting)
  try {
    await supabaseAdmin.from('ai_requests').insert([{ user_id: user.id, ip }])
  } catch (e) {
    console.warn('Could not record ai_request', e.message)
  }

  // Fetch site content (top 5 cosmetics + latest 5 approved leaks) to include in prompt
  let snippets = ''
  try {
    const { data: cosmetics } = await supabaseAdmin.from('cosmetics').select('name,rarity').order('id', { ascending: false }).limit(5)
    if (cosmetics && cosmetics.length) {
      snippets += 'Top cosmetics (name - rarity):\n'
      cosmetics.forEach(c => snippets += `- ${c.name} (${c.rarity})\n`)
    }
    const { data: leaks } = await supabaseAdmin.from('leaks').select('title,description').eq('status', 'approved').order('created_at', { ascending: false }).limit(5)
    if (leaks && leaks.length) {
      snippets += '\nRecent approved leaks (title - description):\n'
      leaks.forEach(l => snippets += `- ${l.title}: ${l.description}\n`)
    }
  } catch (e) {
    console.warn('Could not fetch site snippets', e.message)
  }

  // Build system + user messages
  const systemPrompt = `
You are Gorilla Buddy, a friendly, short, and kid-appropriate assistant for Gorilla Tag players (target age 10-15).
Always keep answers safe, short, and helpful. Do NOT instruct on cheating, hacks, or anything illegal.
When possible, prefer information from the site snippets supplied below. If the question is outside the site content, answer plainly.
Site snippets:
${snippets}
  `

  // Build chat request
  const payload = {
    model: 'gpt-4o-mini', // recommended, but change if needed in your OpenAI account
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 400
  }

  try {
    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    })
    const aiJson = await aiRes.json()
    const text = aiJson?.choices?.[0]?.message?.content || 'Sorry, no response.'
    return res.status(200).json({ text })
  } catch (e) {
    console.error('OpenAI error', e)
    return res.status(500).json({ error: 'OpenAI error' })
  }
}
