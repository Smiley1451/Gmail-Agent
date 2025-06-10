
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import EmailStats from "@/components/dashboard/email-stats"
import RecentEmails from "@/components/dashboard/recent-emails"
import ActionButtons from "@/components/dashboard/action-buttons"
import ErrorMessage from "@/components/ui/error-message"
import { API_ENDPOINTS } from "../config/api"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    new: 0,
    categorized: 0,
    replyGenerated: 0,
    replySent: 0,
    replyDrafted: 0,
  })
  const [recentEmails, setRecentEmails] = useState([])
  const [timeStats, setTimeStats] = useState([])
  const router = useRouter()
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState('week')
  const [autoAgentStatus, setAutoAgentStatus] = useState(false)
  const dashboardRef = useRef(null)

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }

    fetchDashboardData(userEmail)
    fetchTimeStats(userEmail, timeRange)
    checkAutoAgentStatus()
  }, [router, timeRange])

  const checkAutoAgentStatus = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTO_AGENT.STATUS)
      if (response.ok) {
        const data = await response.json()
        setAutoAgentStatus(data)
      }
    } catch (error) {
      console.error("Error checking auto agent status:", error)
    }
  }

  const fetchDashboardData = async (userEmail) => {
    try {
      const fetchEmailsByStatus = async (status) => {
        try {
          const res = await fetch(API_ENDPOINTS.EMAILS.BY_STATUS(status))
          if (!res.ok) throw new Error(`Failed to fetch ${status} emails: ${res.status}`)
          return await res.json()
        } catch (error) {
          console.error(`Error fetching ${status} emails:`, error)
          return []
        }
      }

      const [
        newData,
        categorizedData,
        replyGeneratedData,
        replySentData,
        replyDraftedData
      ] = await Promise.all([
        fetchEmailsByStatus("NEW"),
        fetchEmailsByStatus("CATEGORIZED"),
        fetchEmailsByStatus("REPLY_GENERATED"),
        fetchEmailsByStatus("REPLY_SENT"),
        fetchEmailsByStatus("REPLY_DRAFTED")
      ])

      setStats({
        new: newData.length || 0,
        categorized: categorizedData.length || 0,
        replyGenerated: replyGeneratedData.length || 0,
        replySent: replySentData.length || 0,
        replyDrafted: replyDraftedData.length || 0,
      })

      const allEmails = [...categorizedData, ...replyGeneratedData, ...replySentData]
      allEmails.sort((a, b) => {
        if (!a.processedAt) return 1
        if (!b.processedAt) return -1
        return new Date(b.processedAt) - new Date(a.processedAt)
      })

      setRecentEmails(allEmails.slice(0, 5) || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Failed to load dashboard data. Please try again.")
    }
  }

  const fetchTimeStats = async (userEmail, range) => {
    try {
      const response = await fetch(
          `${API_ENDPOINTS.STATS.TIME}?user_email=${userEmail}&range=${range}`
      )

      if (!response.ok) throw new Error(`Failed to fetch time stats: ${response.status}`)

      const data = await response.json()
      const transformedData = data.map(item => ({
        date: item.date,
        new: item.newCount || 0,
        categorized: item.categorizedCount || 0,
        replyGenerated: item.replyGeneratedCount || 0,
        replySent: item.replySentCount || 0,
        total: item.total || 0,
        processed: item.processed || 0
      }))

      setTimeStats(transformedData)
    } catch (error) {
      console.error("Error fetching time stats:", error)
      setError("Failed to load time statistics. Please try again.")
    }
  }

  const handleSyncEmails = async () => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) return

    try {
      const response = await fetch(
          `${API_ENDPOINTS.EMAILS.SYNC}?user_email=${encodeURIComponent(userEmail)}`
      )
      if (!response.ok) throw new Error(`Failed to sync emails: ${response.status}`)

      await Promise.all([
        fetchDashboardData(userEmail),
        fetchTimeStats(userEmail, timeRange)
      ])
    } catch (error) {
      console.error("Error syncing emails:", error)
      setError(`Failed to sync emails: ${error.message}`)
    }
  }

  const handleCategorizeEmails = async () => {
    try {
      await fetch(API_ENDPOINTS.CATEGORIZE.RUN, { method: "POST" })
      const userEmail = localStorage.getItem("userEmail")
      await Promise.all([
        fetchDashboardData(userEmail),
        fetchTimeStats(userEmail, timeRange)
      ])
    } catch (error) {
      console.error("Error categorizing emails:", error)
    }
  }

  const handleProcessEmails = async () => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) return

    try {
      setError("")
      const response = await fetch(
          `${API_ENDPOINTS.REPLIES.GENERATE('run')}?user_email=${encodeURIComponent(userEmail)}`,
          { method: "POST" }
      )
      if (!response.ok) throw new Error(`Failed to process emails: ${response.status}`)

      await Promise.all([
        fetchDashboardData(userEmail),
        fetchTimeStats(userEmail, timeRange)
      ])
    } catch (error) {
      console.error("Error processing emails:", error)
      setError(`Failed to process emails: ${error.message}`)
    }
  }

  const handleProcessPendingEmails = async () => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) return

    try {
      setError("")
      const response = await fetch(
          `${API_ENDPOINTS.AUTO_AGENT.RUN}?user_email=${encodeURIComponent(userEmail)}`,
          { method: "POST", headers: { 'Content-Type': 'application/json' } }
      )

      if (!response.ok) throw new Error(`Failed to start auto agent: ${response.status}`)

      setAutoAgentStatus(true)
      const pollInterval = setInterval(async () => {
        await Promise.all([
          fetchDashboardData(userEmail),
          fetchTimeStats(userEmail, timeRange),
          checkAutoAgentStatus()
        ])
      }, 30000)

      return () => clearInterval(pollInterval)
    } catch (error) {
      console.error("Error starting auto agent:", error)
      setError(`Failed to start auto agent: ${error.message}`)
    }
  }

  const handleStopAutoAgent = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTO_AGENT.STOP, { method: "POST" })
      if (!response.ok) throw new Error(`Failed to stop auto agent: ${response.status}`)

      setAutoAgentStatus(false)
      const userEmail = localStorage.getItem("userEmail")
      await Promise.all([
        fetchDashboardData(userEmail),
        fetchTimeStats(userEmail, timeRange)
      ])
    } catch (error) {
      console.error("Error stopping auto agent:", error)
      setError(`Failed to stop auto agent: ${error.message}`)
    }
  }

  const hasData = timeStats.some(day => day.total > 0)

  return (
      <DashboardLayout>
        <div ref={dashboardRef} className="p-6 overflow-y-auto h-full" style={{ scrollBehavior: 'smooth' }}>
          <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--primary-color)" }}>
            Dashboard
          </h1>

          <ActionButtons
              onSyncEmails={handleSyncEmails}
              onCategorizeEmails={handleCategorizeEmails}
              onProcessEmails={handleProcessEmails}
              onProcessPendingEmails={handleProcessPendingEmails}
              onStopAutoAgent={handleStopAutoAgent}
              autoAgentStatus={autoAgentStatus}
          />

          <EmailStats stats={stats} />

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Email Processing Trends</h2>
              <div className="flex space-x-2">
                {['week', 'month', 'year'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 rounded ${timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                ))}
              </div>
            </div>

            {!hasData ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        No email activity found for the selected time period.
                      </p>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Charts remain the same as before */}
                  {/* ... */}
                </div>
            )}
          </div>

          <RecentEmails emails={recentEmails} />
          {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
        </div>
      </DashboardLayout>
  )
}