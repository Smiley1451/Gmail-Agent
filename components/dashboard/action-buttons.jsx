"use client"

import { useState } from "react"
import StatusCard from  "@/components/status-card"

export default function ActionButtons({ onSyncEmails, onCategorizeEmails, onProcessEmails, onProcessPendingEmails, onStopAutoAgent, autoAgentStatus }) {
  const [syncLoading, setSyncLoading] = useState(false)
  const [categorizeLoading, setCategorizeLoading] = useState(false)
  const [processLoading, setProcessLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  const handleSyncClick = async () => {
    setSyncLoading(true)
    try {
      await onSyncEmails()
      showStatusMessage("Emails synced successfully", "success")
    } catch (error) {
      console.error("Error syncing emails:", error)
      showStatusMessage("Failed to sync emails", "error")
    } finally {
      setSyncLoading(false)
    }
  }

  const handleCategorizeClick = async () => {
    setCategorizeLoading(true)
    try {
      await onCategorizeEmails()
      showStatusMessage("Emails categorized successfully", "success")
    } catch (error) {
      console.error("Error categorizing emails:", error)
      showStatusMessage("Failed to categorize emails", "error")
    } finally {
      setCategorizeLoading(false)
    }
  }

  const handleProcessClick = async () => {
    setProcessLoading(true)
    try {
      await onProcessEmails()
      showStatusMessage("Replies generated successfully", "success")
    } catch (error) {
      console.error("Error processing emails:", error)
      showStatusMessage("Failed to generate replies", "error")
    } finally {
      setProcessLoading(false)
    }
  }

  const handleAutoAgentClick = async () => {
    try {
      if (autoAgentStatus) {
        await onStopAutoAgent()
        showStatusMessage("Auto Agent stopped", "info")
      } else {
        await onProcessPendingEmails()
        showStatusMessage("Auto Agent started", "info")
      }
    } catch (error) {
      console.error("Error toggling auto agent:", error)
      showStatusMessage(`Failed to ${autoAgentStatus ? 'stop' : 'start'} Auto Agent`, "error")
    }
  }

  const showStatusMessage = (message, type) => {
    setStatusMessage({ message, type })
    setTimeout(() => setStatusMessage(null), 5000)
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statusMessage && (
            <div className="fixed top-4 right-4 z-50">
              <StatusCard message={statusMessage.message} type={statusMessage.type} />
            </div>
        )}

        <div className="card p-6">
          <h3 className="text-lg font-bold mb-2" style={{ color: "var(--primary-color)" }}>
            Sync Emails
          </h3>
          <p className="text-gray-600 mb-4">Fetch new emails from your Gmail account and store them for processing.</p>
          <button
              className="btn-primary flex items-center justify-center"
              onClick={handleSyncClick}
              disabled={syncLoading}
          >
            {syncLoading ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  Syncing...
                </>
            ) : (
                "Sync Now"
            )}
          </button>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold mb-2" style={{ color: "#f59e0b" }}>
            Categorize Emails
          </h3>
          <p className="text-gray-600 mb-4">Use AI to categorize all new emails based on their content and context.</p>
          <button
              className="btn-secondary flex items-center justify-center"
              style={{ backgroundColor: categorizeLoading ? "#f8b84e" : "#f59e0b" }}
              onClick={handleCategorizeClick}
              disabled={categorizeLoading}
          >
            {categorizeLoading ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  Categorizing...
                </>
            ) : (
                "Categorize Now"
            )}
          </button>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold mb-2" style={{ color: "var(--secondary-color)" }}>
            Generate Replies
          </h3>
          <p className="text-gray-600 mb-4">Generate AI-powered replies for categorized emails that need responses.</p>
          <button
              className="btn-secondary flex items-center justify-center"
              onClick={handleProcessClick}
              disabled={processLoading}
          >
            {processLoading ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  Generating...
                </>
            ) : (
                "Generate Now"
            )}
          </button>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold mb-2" style={{ color: "#10b981" }}>
            Auto Agent
          </h3>
          <p className="text-gray-600 mb-4">Automatically fetch, categorize, generate replies, and send them.</p>
          <button
              className={`flex items-center justify-center ${autoAgentStatus ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white py-2 px-4 rounded transition-colors`}
              onClick={handleAutoAgentClick}
          >
            {autoAgentStatus ? (
                "Stop Auto Agent"
            ) : (
                "Start Auto Agent"
            )}
          </button>
          {autoAgentStatus && (
              <p className="text-sm text-green-600 mt-2">Auto Agent is currently running</p>
          )}
        </div>
      </div>
  )
}