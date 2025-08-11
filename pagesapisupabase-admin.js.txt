// pages/api/supabase-admin.js
import { supabaseAdmin } from '../../lib/supabaseAdmin'

/**
 * API actions:
 * - GET ?action=check-admin  (requires Authorization: Bearer <access_token>)
 * - POST ?action=create-cosmetic  (body: { name, rarity, image_url }) -- requires admin token
 * - POST ?action=update-leak (body: { id, status }) -- requires admin token
 *
 * This endpoint uses the service role key to perform DB writes.
 */

async function getUserFromToken(token) {
  // Use Supabase auth REST endpoint to validate access token and get user
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return null
  return res.json() // returns user object
}

export default async function handler(req, res) {
  const { action } = req.query

  // require Authorization header for admin checks/writes
  const authHeader = req.headers.authorization || ''
  const token = authHeader?.split('Bearer ')?.[1] || null
  if (!token) return res.status(401).json({ error: 'Missing token' })

  const user = await getUserFromToken(token)
  if (!user?.id) return res.status(401).json({ error: 'Invalid token' })

  // check if user is in admins table
  const { data: admins } = await supabaseAdmin.from('admins').select('*').eq('user_id', user.id).limit(1)
  const isAdmin = (admins && admins.length > 0)

  if (action === 'check-admin') {
    return res.status(200).json({ isAdmin })
  }

  if (!isAdmin) return res.status(403).json({ error: 'Requires admin' })

  if (action === 'create-cosmetic' && req.method === 'POST') {
    const { name, rarity, image_url } = req.body
    if (!name || !image_url) return res.status(400).json({ error: 'Missing fields' })
    const { error } = await supabaseAdmin.from('cosmetics').insert([{ name, rarity, image_url }])
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  if (action === 'update-leak' && req.method === 'POST') {
    const { id, status } = req.body
    if (!id || !status) return res.status(400).json({ error: 'Missing fields' })
    const { error } = await supabaseAdmin.from('leaks').update({ status }).eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(400).json({ error: 'Unknown action' })
}
