// components/Navbar.js
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useAuth } from './AuthProvider'
import Account from './Account'

export default function Navbar() {
  const { user, loading } = useAuth()

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center gap-6">
        <Link href="/"><a className="text-2xl font-bold">Gorilla Hub</a></Link>
        <Link href="/tutorials"><a> Tutorials</a></Link>
        <Link href="/cosmetics"><a> Cosmetics</a></Link>
        <Link href="/leaks"><a> Leaks</a></Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/support"><a>Support</a></Link>
        <Link href="/tos"><a>TOS</a></Link>
        <ThemeToggle />
        {/* show account controls */}
        {!loading && <Account />}
      </div>
    </nav>
  )
}
