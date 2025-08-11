// pages/tos.js
export default function Tos() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <div className="bg-gray-800 p-4 rounded">
        <p>Welcome to Gorilla Hub. By using this site you agree to these rules:</p>
        <ol className="list-decimal ml-6 mt-2">
          <li>Be respectful. No harassment or hateful content.</li>
          <li>Users should be 13+ or have parental permission (kids safety).</li>
          <li>Do not post copyrighted material without permission. For DMCA complaints contact: replace-with-email@example.com.</li>
          <li>Admins may remove content that violates the rules.</li>
        </ol>
        <p className="mt-3">This is a general template — replace contact email with your own.</p>
      </div>
    </div>
  )
}
