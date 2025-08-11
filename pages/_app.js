// pages/_app.js
import '../styles/globals.css'
import { AuthProvider } from '../components/AuthProvider'
import Navbar from '../components/Navbar'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="p-4">
          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  )
}

export default MyApp
