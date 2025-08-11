// pages/cosmetics.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Cosmetics() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // get all cosmetics
      const { data, error } = await supabase.from('cosmetics').select('*')
      if (error) {
        console.error('fetch cosmetics', error)
        setItems([])
      } else {
        // sort by rarity: legendary > epic > rare > uncommon > common
        const rank = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 }
        const sorted = (data || []).sort((a,b) => (rank[b.rarity]||0) - (rank[a.rarity]||0))
        setItems(sorted)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cosmetics & Rarity</h1>
      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(c => (
          <div key={c.id} className="p-3 bg-gray-800 rounded">
            <img src={c.image_url} alt={c.name} className="w-full h-40 object-cover rounded mb-2" />
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm">Rarity: {c.rarity}</div>
          </div>
        ))}
        {items.length === 0 && <div className="p-4 bg-gray-800 rounded">No cosmetics yet.</div>}
      </div>
    </div>
  )
}
