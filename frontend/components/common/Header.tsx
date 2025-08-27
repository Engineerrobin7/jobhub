'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-black text-lg">J</span>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">JobHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200 relative group text-lg">
              Jobs
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200 relative group text-lg">
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200 relative group text-lg">
              Profile
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <span className="text-gray-700 font-semibold">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-6 py-3 text-gray-700 hover:text-red-600 font-semibold transition-colors duration-200 rounded-xl hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-6 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200 rounded-xl hover:bg-blue-50">
                  Login
                </Link>
                <Link href="/register" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4">
              <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200 px-4 py-3 rounded-xl hover:bg-blue-50 text-lg">
                Jobs
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200 px-4 py-3 rounded-xl hover:bg-blue-50 text-lg">
                Dashboard
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200 px-4 py-3 rounded-xl hover:bg-blue-50 text-lg">
                Profile
              </Link>
              {user ? (
                <div className="flex flex-col space-y-3 px-4">
                  <div className="flex items-center space-x-3 py-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                    </div>
                    <span className="text-gray-700 font-semibold">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-left text-gray-700 hover:text-red-600 font-semibold transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 px-4">
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-blue-50">
                    Login
                  </Link>
                  <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl py-3 px-4 text-center transition-all duration-200">
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
