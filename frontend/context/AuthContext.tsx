'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'jobseeker' | 'employer'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: 'jobseeker' | 'employer') => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('jobhub_token')
        if (token) {
          // In a real app, you'd validate the token with your backend
          const userData = localStorage.getItem('jobhub_user')
          if (userData) {
            setUser(JSON.parse(userData))
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      // In a real app, you'd make an API call here
      // For now, we'll simulate a successful login
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        role: 'jobseeker'
      }
      
      localStorage.setItem('jobhub_token', 'mock_token')
      localStorage.setItem('jobhub_user', JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      throw new Error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: 'jobseeker' | 'employer') => {
    try {
      setLoading(true)
      // In a real app, you'd make an API call here
      // For now, we'll simulate a successful registration
      const mockUser: User = {
        id: '1',
        name,
        email,
        role
      }
      
      localStorage.setItem('jobhub_token', 'mock_token')
      localStorage.setItem('jobhub_user', JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      throw new Error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('jobhub_token')
    localStorage.removeItem('jobhub_user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
