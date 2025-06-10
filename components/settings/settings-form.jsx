"use client"

import { useState } from "react"

export default function SettingsForm({ settings, onUpdateSettings }) {
  const [formData, setFormData] = useState({
    model: settings?.model || "GPT-3.5",
    replyMode: settings?.replyMode || "DRAFT",
    aiProvider: settings?.aiProvider || "OPENAI",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdateSettings({
      ...settings,
      ...formData,
    })
  }

  return (
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary-color)" }}>
          AI Settings
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="model" className="block text-sm font-medium mb-1">
              AI Model
            </label>
            <select
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="GPT-3.5">GPT-3.5</option>
              <option value="GPT-4">GPT-4</option>
              <option value="CLAUDE">Claude</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="replyMode" className="block text-sm font-medium mb-1">
              Reply Mode
            </label>
            <select
                id="replyMode"
                name="replyMode"
                value={formData.replyMode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="DRAFT">Save as Draft</option>
              <option value="SEND">Send Automatically</option>
              <option value="MANUAL">Manual Review</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="aiProvider" className="block text-sm font-medium mb-1">
              AI Provider
            </label>
            <select
                id="aiProvider"
                name="aiProvider"
                value={formData.aiProvider}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="OPENAI">OpenAI</option>
              <option value="ANTHROPIC">Anthropic</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Save Settings
          </button>
        </form>
      </div>
  )
}