// pages/index.js
import AIChat from '../components/AIChat'

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">Welcome to Gorilla Hub</h1>
      <p className="mb-4">A central hub for Gorilla Tag players — tutorials, cosmetics, leaks, and an AI helper.</p>

      <section className="bg-gray-800 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Gorilla Assistant</h2>
        <p className="text-sm mb-2">Ask the AI anything about Gorilla Tag. It's tailored to young players (kid-friendly).</p>
        <AIChat />
      </section>

      <section>
        <h2 className="font-semibold">Quick Links</h2>
        <ul className="list-disc ml-6">
          <li>Latest tutorials</li>
          <li>Cosmetics & rarity</li>
          <li>Leaks and updates</li>
        </ul>
      </section>
    </div>
  )
}
