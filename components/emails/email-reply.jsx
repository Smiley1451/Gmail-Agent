"use client"

import { useState } from "react"
import StatusCard from "@/components/status-card"

export default function EmailReply({ reply, onSend, onSaveAsDraft }) {
  const [editedReply, setEditedReply] = useState(reply.replyBody || "")
  const [statusMessage, setStatusMessage] = useState(null)

  const showStatusMessage = (message, type) => {
    setStatusMessage({ message, type })
    setTimeout(() => setStatusMessage(null), 5000)
  }

  const handleSend = async () => {
    try {
      await onSend(editedReply)
      showStatusMessage("Reply sent successfully", "success")
    } catch (error) {
      console.error("Error sending reply:", error)
      showStatusMessage("Failed to send reply", "error")
    }
  }

  const handleSaveAsDraft = async () => {
    try {
      await onSaveAsDraft(editedReply)
      showStatusMessage("Reply saved as draft", "success")
    } catch (error) {
      console.error("Error saving as draft:", error)
      showStatusMessage("Failed to save as draft", "error")
    }
  }

  return (
      <div className="card p-6 mt-6">
        {statusMessage && (
            <div className="mb-4">
              <StatusCard message={statusMessage.message} type={statusMessage.type} />
            </div>
        )}

        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--secondary-color)" }}>
          AI-Generated Reply
        </h2>

        <div className="mb-4">
          <label htmlFor="reply" className="block text-sm font-medium mb-1">
            Edit Reply (if needed)
          </label>
          <textarea
              id="reply"
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={editedReply}
              onChange={(e) => setEditedReply(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button className="btn-primary" onClick={handleSend}>
            Send Reply
          </button>
          <button className="btn-outline" onClick={handleSaveAsDraft}>
            Save as Draft
          </button>
        </div>
      </div>
  )
}