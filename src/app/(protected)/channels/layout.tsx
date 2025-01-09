"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/features/auth-store"
import { authAPI } from "@/services/api"

export default function ChannelsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, setUser } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.me()
        setUser(response.user)
      } catch (error) {
        router.push("/login")
      }
    }

    if (!user) {
      checkAuth()
    }
  }, [user, setUser, router])

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen">
      {children}
    </div>
  )
} 