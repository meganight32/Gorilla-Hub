// components/ThemeToggle.js
export default function ThemeToggle() {
  function toggle() {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  // init theme once
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark') // default dark
    document.documentElement.classList.toggle('dark', localStorage.getItem('theme') === 'dark')
  }

  return (
    <button onClick={toggle} className="p-2 rounded bg-gray-700" aria-label="Toggle theme">
      ⚙️
    </button>
  )
}
