import { useState } from 'react'
import { AiOutlineGlobal } from 'react-icons/ai'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <AiOutlineGlobal className="text-2xl text-white" />
          <span className="text-xl font-bold text-white">New World Alliance</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`${isActive('/') ? 'text-white font-bold' : 'text-gray-300'} hover:text-white transition-colors`}
          >
            Home
          </Link>
          <Link 
            to="/cards" 
            className={`${isActive('/cards') ? 'text-white font-bold' : 'text-gray-300'} hover:text-white transition-colors`}
          >
            Cards
          </Link>
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`${isActive('/admin') ? 'text-white font-bold' : 'text-gray-300'} hover:text-white transition-colors`}
            >
              Admin
            </Link>
          )}
          {user ? (
            <button 
              onClick={logout} 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`${isActive('/login') ? 'text-white font-bold' : 'text-gray-300'} hover:text-white transition-colors`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`${isActive('/register') ? 'text-white font-bold' : 'text-gray-300'} hover:text-white transition-colors`}
              >
                Register
              </Link>
            </>
          )}
        </nav>

        <button 
          className="md:hidden p-2 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <nav className="flex flex-col p-4 gap-4">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-white font-bold' : 'text-gray-300'} hover:text-white transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/cards" 
              className={`${isActive('/cards') ? 'text-white font-bold' : 'text-gray-300'} hover:text-white transition-colors`}
            >
              Cards
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`${isActive('/admin') ? 'text-white font-bold' : 'text-gray-300'} hover:text-white transition-colors`}
              >
                Admin
              </Link>
            )}
            {user ? (
              <button 
                onClick={logout} 
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`${isActive('/login') ? 'text-white font-bold' : 'text-gray-300'} hover:text-white transition-colors`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`${isActive('/register') ? 'text-white font-bold' : 'text-gray-300'} hover:text-white transition-colors`}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

