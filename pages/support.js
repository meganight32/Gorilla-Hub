// pages/support.js
export default function Support() {
  const actionUrl = process.env.NEXT_PUBLIC_FORMSPREE_URL || 'https://formspree.io/f/xvgqdlkd'
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Support</h1>
      <form action={actionUrl} method="POST" className="bg-gray-800 p-4 rounded max-w-lg">
        <label className="block mb-1">Email</label>
        <input type="email" name="email" required className="w-full p-2 mb-2 bg-gray-700 rounded" />
        <label className="block mb-1">Message</label>
        <textarea name="message" required className="w-full p-2 mb-2 bg-gray-700 rounded"></textarea>
        <button type="submit" className="bg-blue-600 px-3 py-2 rounded">Send</button>
      </form>
    </div>
  )
}
