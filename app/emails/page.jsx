// src/app/emails/page.jsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import EmailList from "@/components/emails/email-list"
import EmailFilters from "@/components/emails/email-filters"
import StatusCard from "@/components/status-card"
import ErrorMessage from "@/components/ui/error-message"
import { API_ENDPOINTS } from "../config/api"


export default function EmailsPage() {
  const [emails, setEmails] = useState([])
  const [filter, setFilter] = useState("all")
  const [error, setError] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }

    fetchEmails()
  }, [router, filter])

  const showStatusMessage = (message, type) => {
    setStatusMessage({ message, type })
    setTimeout(() => setStatusMessage(null), 5000)
  }

  const fetchEmails = async () => {
    try {
      let url
      const categoryMap = {
        spam: "SPAM",
        business_query: "BUSINESS_QUERY",
        complaint: "COMPLAINT",
        enquiry: "ENQUIRY",
        feedback: "FEEDBACK",
        uncategorized: "UNCATEGORIZED",
        other: "OTHER"
      }

      if (filter === "all") {
        url = API_ENDPOINTS.EMAILS.ALL
      } else if (categoryMap[filter]) {
        url = API_ENDPOINTS.EMAILS.BY_CATEGORY(categoryMap[filter])
      } else {
        url = API_ENDPOINTS.EMAILS.BY_STATUS(filter.toUpperCase())
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to fetch emails: ${response.status}`)

      const data = await response.json()

      if (categoryMap[filter]) {
        const filteredData = data.filter((email) => email.category === categoryMap[filter])
        setEmails(filteredData || [])
      } else {
        setEmails(data || [])
      }
    } catch (error) {
      console.error("Error fetching emails:", error)
      setError(`Failed to fetch emails: ${error.message}`)
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  const handleEmailClick = (emailId) => {
    router.push(`/emails/${emailId}`)
  }

  const handleCategorizeAll = async () => {
    try {
      setError("")
      await fetch(API_ENDPOINTS.CATEGORIZE.RUN, { method: "POST" })
      showStatusMessage("All emails categorized successfully", "success")
      fetchEmails()
    } catch (error) {
      console.error("Error categorizing all emails:", error)
      setError("Failed to categorize all emails. Please try again.")
    }
  }

  return (
      <DashboardLayout>
        <div className="p-6">
          {statusMessage && (
              <div className="fixed top-4 right-4 z-50">
                <StatusCard message={statusMessage.message} type={statusMessage.type} />
              </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold" style={{ color: "var(--primary-color)" }}>
              Emails
            </h1>

            <div className="flex gap-2">
              <button className="btn-primary flex items-center" onClick={() => fetchEmails()}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>

              {filter === "new" && emails.length > 0 && (
                  <button className="btn-secondary" style={{ backgroundColor: "#f59e0b" }} onClick={handleCategorizeAll}>
                    Categorize All
                  </button>
              )}
            </div>
          </div>

          <EmailFilters activeFilter={filter} onFilterChange={handleFilterChange} />
          <EmailList emails={emails} onEmailClick={handleEmailClick} />
          {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
        </div>
      </DashboardLayout>
  )
}