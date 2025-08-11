// components/Account.js
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import { useAuth } from './AuthProvider'

export default function Account() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link href="/auth/signin"><a className="bg-blue-600 px-3 py-1 rounded">Sign in</a></Link>
        <Link href="/auth/signup"><a className="bg-green-600 px-3 py-1 rounded">Sign up</a></Link>
      </div>
    )
  }

  async function signOut() {
    await supabase.auth.signOut()
    // supabase will update auth state via subscription
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm">Hi, {user.email || user.id.substring(0,6)}</div>
      <Link href="/admin"><a className="px-2 py-1 border rounded">Admin</a></Link>
      <button onClick={signOut} className="px-2 py-1 bg-red-600 rounded">Sign out</button>
    </div>
  )
}
