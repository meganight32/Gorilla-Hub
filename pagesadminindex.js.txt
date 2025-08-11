// pages/admin/index.js
import AdminGuard from '../../components/AdminGuard'
import AdminCosmeticForm from '../../components/AdminCosmeticForm'
import AdminLeaksPanel from '../../components/AdminLeaksPanel'

export default function AdminPage() {
  return (
    <AdminGuard>
      <div>
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <section className="bg-gray-800 p-4 rounded mb-6">
          <h2 className="font-semibold mb-2">Add Cosmetic</h2>
          <AdminCosmeticForm />
        </section>

        <section className="bg-gray-800 p-4 rounded">
          <h2 className="font-semibold mb-2">Pending Leaks</h2>
          <AdminLeaksPanel />
        </section>
      </div>
    </AdminGuard>
  )
}
