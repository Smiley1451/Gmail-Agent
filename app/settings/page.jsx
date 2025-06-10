"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import StatusCard from "@/components/status-card"
import { API_ENDPOINTS } from "../config/api"

export default function BusinessInfoPage() {
  const router = useRouter()
  const [statusMessage, setStatusMessage] = useState(null)
  const [businessInfo, setBusinessInfo] = useState("")
  const [loading, setLoading] = useState(false)

  const showStatusMessage = (message, type) => {
    setStatusMessage({ message, type })
    setTimeout(() => setStatusMessage(null), 5000)
  }

  const handleUpdateBusinessInfo = async () => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail || !businessInfo.trim()) return

    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.BUSINESS.UPDATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(businessInfo),
      })

      if (!response.ok) {
        throw new Error(`Failed to update business info: ${response.status}`)
      }

      setBusinessInfo("")
      showStatusMessage("Business information updated successfully", "success")
    } catch (error) {
      console.error("Error updating business info:", error)
      showStatusMessage(`Failed to update business info: ${error.message}`, "error")
    } finally {
      setLoading(false)
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

          <h1 className="text-3xl font-bold mb-6 text-primary">
            Business Information
          </h1>

          <div className="card p-6 max-w-2xl">
            <div className="mb-4">
              <label htmlFor="businessInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Update your business information
              </label>
              <textarea
                  id="businessInfo"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={8}
                  placeholder="Enter your business details (products, services, policies, etc.)"
                  value={businessInfo}
                  onChange={(e) => setBusinessInfo(e.target.value)}
              />
            </div>
            <button
                className="btn-primary w-full"
                onClick={handleUpdateBusinessInfo}
                disabled={!businessInfo.trim() || loading}
            >
              {loading ? "Updating..." : "Update Business Information"}
            </button>
          </div>
        </div>
      </DashboardLayout>
  )
}