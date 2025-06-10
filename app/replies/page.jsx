// src/app/replies/page.jsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import ReplyList from "@/components/replies/reply-list"
import ReplyFilters from "@/components/replies/reply-filters"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ErrorMessage from "@/components/ui/error-message"
import { API_ENDPOINTS } from "../config/api"

export default function RepliesPage() {
  const [loading, setLoading] = useState(true)
  const [replies, setReplies] = useState([])
  const [filter, setFilter] = useState("generated")
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }

    fetchReplies(userEmail)
  }, [router, filter])

  const fetchReplies = async (userEmail) => {
    try {
      let endpoint
      switch (filter) {
        case "sent":
          endpoint = API_ENDPOINTS.REPLIES.BY_STATUS("SENT")
          break
        case "drafted":
          endpoint = API_ENDPOINTS.REPLIES.BY_STATUS("DRAFTED")
          break
        case "failed":
          endpoint = API_ENDPOINTS.REPLIES.BY_STATUS("FAILED")
          break
        case "generated":
        default:
          endpoint = API_ENDPOINTS.REPLIES.BY_STATUS("GENERATED")
      }

      const response = await fetch(endpoint)
      if (!response.ok) throw new Error(`Failed to fetch replies: ${response.status}`)

      const data = await response.json()
      setReplies(data || [])
    } catch (error) {
      console.error("Error fetching replies:", error)
      setError(`Failed to load replies: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSendAll = async () => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) return

    try {
      setLoading(true)
      setError(null)
      const response = await fetch(
          `${API_ENDPOINTS.REPLIES.SEND_ALL}?userEmail=${encodeURIComponent(userEmail)}`,
          { method: "POST" }
      )
      if (!response.ok) throw new Error(`Failed to send all replies: ${response.status}`)
      await fetchReplies(userEmail)
    } catch (error) {
      console.error("Error sending all replies:", error)
      setError(`Failed to send all replies: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDraftAll = async () => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) return

    try {
      setLoading(true)
      setError(null)
      const response = await fetch(
          `${API_ENDPOINTS.REPLIES.DRAFT_ALL}?userEmail=${encodeURIComponent(userEmail)}`,
          { method: "POST" }
      )
      if (!response.ok) throw new Error(`Failed to save all replies as drafts: ${response.status}`)
      await fetchReplies(userEmail)
    } catch (error) {
      console.error("Error drafting all replies:", error)
      setError(`Failed to save all replies as drafts: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  if (loading) {
    return (
        <DashboardLayout>
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="large" />
          </div>
        </DashboardLayout>
    )
  }

  return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold" style={{ color: "var(--primary-color)" }}>
              Replies
            </h1>

            <div className="flex gap-2">
              {filter === "generated" && (
                  <>
                    <button className="btn-primary" onClick={handleSendAll} disabled={replies.length === 0}>
                      Send All
                    </button>
                    <button className="btn-outline" onClick={handleDraftAll} disabled={replies.length === 0}>
                      Save All as Drafts
                    </button>
                  </>
              )}
            </div>
          </div>

          <ReplyFilters activeFilter={filter} onFilterChange={handleFilterChange} />
          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
          <ReplyList replies={replies} />
        </div>
      </DashboardLayout>
  )
}