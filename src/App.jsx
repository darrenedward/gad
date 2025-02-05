import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import AdminPanel from './components/AdminPanel'
import UserCards from './components/UserCards'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { useAuth } from './hooks/useAuth'

function PrivateRoute({ children, auth }) {
  return auth ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cards" element={<UserCards />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute auth={!!user}>
                <Dashboard />
              </PrivateRoute>
            } />
            {user?.role === 'admin' && (
              <Route path="/admin" element={<AdminPanel />} />
            )}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
