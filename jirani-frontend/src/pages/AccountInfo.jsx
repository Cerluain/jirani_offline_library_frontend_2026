import { useAuth } from '../hooks/useAuth'
import { StudentLayout } from '../components/templates/StudentLayout'
import { TeacherLayout } from '../components/templates/TeacherLayout'

/**
 * AccountInfo (Shared)
 * User profile, password change, logout
 */
export default function AccountInfo() {
  const { user, logout, role } = useAuth()
  const Layout = role === 'teacher' ? TeacherLayout : StudentLayout

  const handleLogout = () => {
    logout()
    window.location.href = '/auth/login'
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Account Settings</h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <section className="border-b pb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.fullName || user?.email || 'User'}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Role</label>
                <input
                  type="text"
                  defaultValue={role?.toUpperCase() || 'USER'}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>
            </div>
          </section>

          <section className="border-b pb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security</h2>
            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Change Password
            </button>
            <p className="text-gray-600 text-sm mt-2">TODO: Implement password change form</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sign Out</h2>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </section>
        </div>
      </div>
    </Layout>
  )
}
