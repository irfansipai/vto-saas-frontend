// frontend/context/AuthContext.tsx
"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

interface UserData {
  id: string
  email: string
  is_active: boolean
  is_verified: boolean
  is_admin?: boolean
}

interface AuthContextType {
  user: UserData | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await api.get<UserData>("/api/v1/users/me")
      setUser(response.data)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      setUser(null)
      localStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string) => {
    const formData = new FormData()
    formData.append("username", email)
    formData.append("password", password)

    const response = await api.post("/api/v1/auth/login", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    localStorage.setItem("token", response.data.access_token)
    await fetchUser()
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
  }

  const refreshUser = async () => {
    setIsLoading(true)
    await fetchUser()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}