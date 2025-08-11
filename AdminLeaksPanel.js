// components/AdminLeaksPanel.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthProvider'

export default function AdminLeaksPanel() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(false)
  const { session } = useAuth()

  async function loadPending() {
    setLoading(true)
    const { data, error } = await supabase.from('leaks').select('*').eq('status', 'pending').order('created_at', { ascending: false })
    if (error) {
      console.error('fetch pending leaks', error)
      setPending([])
    } else {
      setPending(data || [])
    }
    setLoading(false)
  }

  useEffect(() => { loadPending() }, [])

  async function updateStatus(id, status) {
    try {
      const res = await fetch('/api/supabase-admin?action=update-leak', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`},
        body: JSON.stringify({ id, status })
      })
      if (!res.ok) throw new Error('Error updating leak')
      await loadPending()
    } catch (e) {
      alert('Error: ' + e.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (pending.length === 0) return <div>No pending leaks</div>

  return (
    <div className="space-y-3">
      {pending.map(l => (
        <div key={l.id} className="p-3 bg-gray-800 rounded">
          <div className="font-semibold">{l.title}</div>
          <div className="text-sm mb-2">{l.description}</div>
          <div className="flex gap-2">
            <button onClick={() => updateStatus(l.id, 'approved')} className="bg-green-600 px-2 py-1 rounded">Approve</button>
            <button onClick={() => updateStatus(l.id, 'rejected')} className="bg-red-600 px-2 py-1 rounded">Reject</button>
          </div>
        </div>
      ))}
    </div>
  )
}
