// components/AdminCosmeticForm.js
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthProvider'

export default function AdminCosmeticForm({ onCreated }) {
  const [name, setName] = useState('')
  const [rarity, setRarity] = useState('common')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const { session } = useAuth()

  async function uploadAndCreate(e) {
    e.preventDefault()
    if (!name) return alert('Name required')
    if (!file) return alert('Please choose an image file')

    setLoading(true)
    try {
      const path = `${Date.now()}-${file.name}`
      // upload to storage bucket 'cosmetics'
      const { error: uploadErr } = await supabase.storage
        .from('cosmetics')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadErr) throw uploadErr

      const { data } = supabase.storage.from('cosmetics').getPublicUrl(path)
      const imageUrl = data.publicUrl

      // call server API to ensure DB insert is done server-side (admin-only action)
      const res = await fetch('/api/supabase-admin?action=create-cosmetic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ name, rarity, image_url: imageUrl })
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'Server error')
      }
      setName(''); setRarity('common'); setFile(null)
      if (onCreated) onCreated()
      alert('Cosmetic created')
    } catch (err) {
      console.error(err)
      alert('Error: ' + (err.message || err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={uploadAndCreate} className="space-y-2">
      <label>Name</label>
      <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-gray-700 rounded" required />
      <label>Rarity</label>
      <select value={rarity} onChange={e => setRarity(e.target.value)} className="w-full p-2 bg-gray-700 rounded">
        <option value="legendary">Legendary</option>
        <option value="epic">Epic</option>
        <option value="rare">Rare</option>
        <option value="uncommon">Uncommon</option>
        <option value="common">Common</option>
      </select>
      <label>Image</label>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <div>
        <button type="submit" className="bg-blue-600 px-3 py-2 rounded" disabled={loading}>
          {loading ? 'Uploading...' : 'Create Cosmetic'}
        </button>
      </div>
    </form>
  )
}
