"use client"

import { useState } from "react"

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    onLogin(email)
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary-color)" }}>
        Sign in to continue
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
            required
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <button type="submit" className="w-full btn-primary">
          Continue with Email
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">We'll connect to your Gmail account in the next step</p>
    </div>
  )
}
