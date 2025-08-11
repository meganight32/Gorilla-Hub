// pages/leaks.js
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../components/AuthProvider'

export default function Leaks() {
  const { user, session } = useAuth()
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!user) return alert('Please sign in to submit a leak.')
    if (!title || !desc) return alert('Title and description required')
    setLoading(true)
    try {
      const { error } = await supabase.from('leaks').insert([{ title, description: desc, status: 'pending', submitter: user.id }])
      if (error) throw error
      setTitle(''); setDesc('')
      alert('Leak submitted for moderation')
    } catch (e) {
      console.error(e)
      alert('Error: ' + (e.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leaks</h1>
      <p className="mb-3">Submit text-only leaks. Admins will review and approve or reject.</p>

      <div className="bg-gray-800 p-4 rounded mb-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 mb-2 bg-gray-700 rounded" />
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="w-full p-2 mb-2 bg-gray-700 rounded" />
        <button onClick={submit} className="bg-blue-600 px-3 py-2 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit Leak'}</button>
      </div>

      <p className="text-sm">Approved leaks will be visible after admin approval (admin panel).</p>
    </div>
  )
}
