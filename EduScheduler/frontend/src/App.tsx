import { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from '@/store/auth'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import FacultyDashboard from '@/pages/faculty/FacultyDashboard'
import StudentDashboard from '@/pages/student/StudentDashboard'
import TimetableEditor from '@/pages/admin/TimetableEditor'
import ThemeToggle from '@/components/ThemeToggle'
import { useNotifications } from '@/hooks/useNotifications'

export default function App() {
  const { init, loading, user, logout } = useAuth()
  const { lastMessage } = useNotifications()
  useEffect(() => { init() }, [init])
  return (
    <div>
      <header className="flex items-center justify-between px-4 h-14 border-b border-neutral-200 dark:border-neutral-800">
        <Link to="/" className="font-semibold">EduScheduler</Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? <button onClick={logout} className="px-3 py-1 rounded bg-neutral-200 dark:bg-neutral-800">Logout</button> : null}
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/timetable" element={<TimetableEditor />} />
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
        </Routes>
      </main>
      {loading ? <div className="fixed inset-x-0 bottom-0 p-2 text-center text-xs">Loading...</div> : null}
      {lastMessage ? (
        <div className="fixed right-4 bottom-4 px-3 py-2 rounded bg-neutral-900 text-white shadow-lg text-sm">
          {lastMessage}
        </div>
      ) : null}
    </div>
  )
}

