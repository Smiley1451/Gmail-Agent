"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layouts/sidebar"
import ErrorMessage from "@/components/ui/error-message"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { API_ENDPOINTS } from "../config/api"


export default function DashboardLayout({ children }) {
  const [userEmail, setUserEmail] = useState("")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (!email) {
      router.push("/")
      return
    }

    setUserEmail(email)
    verifyAuthentication(email)
  }, [router])

  const verifyAuthentication = async (email) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.STATUS}?user_email=${encodeURIComponent(email)}`)

      if (!response.ok) {
        throw new Error(`Authentication verification failed: ${response.status}`)
      }

      const data = await response.json()

      if (!data.authenticated) {
        router.push("/auth")
      }
    } catch (error) {
      console.error("Error verifying authentication:", error)
      setError(`Authentication error: ${error.message}`)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }



  return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Error message */}
        {error && (
            <div className="fixed top-0 left-0 right-0 z-50">
              <ErrorMessage message={error} onDismiss={() => setError("")} />
            </div>
        )}

        {/* Mobile sidebar toggle */}
        <div className="md:hidden fixed top-4 left-4 z-30">
          <button onClick={toggleMobileSidebar} className="p-2 rounded-md bg-white shadow-md">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
            <div
                className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
                onClick={() => setMobileSidebarOpen(false)}
            />
        )}

        {/* Sidebar */}
        <div
            className={`fixed md:static inset-y-0 left-0 transform ${
                mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 transition duration-200 ease-in-out z-30 md:z-0`}
        >
          <Sidebar userEmail={userEmail} />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
  )
}