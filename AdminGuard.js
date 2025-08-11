// components/AdminGuard.js
// Client-side guard that checks server endpoint for admin role
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from './AuthProvider'

export default function AdminGuard({ children }) {
  const { user, session, loading } = useAuth()
  const [allowed, setAllowed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function check() {
      if (!session?.access_token) {
        router.push('/auth/signin')
        return
      }
      try {
        const res = await fetch('/api/supabase-admin?action=check-admin', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
        if (res.ok) {
          const json = await res.json()
          if (json.isAdmin) setAllowed(true)
          else {
            alert('You are not an admin.')
            router.push('/')
          }
        } else {
          router.push('/auth/signin')
        }
      } catch (e) {
        console.error('admin check error', e)
        router.push('/')
      }
    }
    if (!loading) check()
  }, [loading, session])

  if (!allowed) return null
  return children
}
