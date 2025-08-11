// components/SignIn.js
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // on success, supabase subscription will update user; redirect:
      router.push('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      {error && <div className="bg-red-600 p-2 mb-2 rounded">{error}</div>}
      <label className="block mb-1">Email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-2 bg-gray-700 rounded" type="email" required />
      <label className="block mb-1">Password</label>
      <input value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-2 bg-gray-700 rounded" type="password" required />
      <button className="bg-blue-600 px-3 py-2 rounded" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
    </form>
  )
}
