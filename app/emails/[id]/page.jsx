// src/app/emails/[id]/page.jsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import EmailDetail from "@/components/emails/email-detail"
import EmailReply from "@/components/emails/email-reply"
import StatusCard from "@/components/status-card"
import ErrorMessage from "@/components/ui/error-message"
import { API_ENDPOINTS } from "../../config/api"

export default function EmailDetailPage({ params }) {
    const [email, setEmail] = useState(null)
    const [reply, setReply] = useState(null)
    const [error, setError] = useState("")
    const [statusMessage, setStatusMessage] = useState(null)
    const router = useRouter()
    const { id } = params

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail")
        if (!userEmail) {
            router.push("/")
            return
        }

        fetchEmailDetails()
    }, [router, id])

    const showStatusMessage = (message, type) => {
        setStatusMessage({ message, type })
        setTimeout(() => setStatusMessage(null), 5000)
    }

    const fetchEmailDetails = async () => {
        try {
            const emailRes = await fetch(API_ENDPOINTS.EMAILS.DETAIL(id))
            if (!emailRes.ok) throw new Error(`Failed to fetch email details: ${emailRes.status}`)

            const emailData = await emailRes.json()
            setEmail(emailData)

            try {
                const replyRes = await fetch(API_ENDPOINTS.REPLIES.GET(id))
                if (replyRes.ok) {
                    const replyData = await replyRes.json()
                    if (replyData?.id) setReply(replyData)
                }
            } catch (error) {
                console.log("No reply exists yet for this email:", error)
            }
        } catch (error) {
            console.error("Error fetching email details:", error)
            setError(`Failed to load email: ${error.message}`)
        }
    }

    const handleGenerateReply = async () => {
        const userEmail = localStorage.getItem("userEmail")
        if (!userEmail || !id) return

        try {
            setError("")
            if (email.status !== "CATEGORIZED" && email.category === "UNCATEGORIZED") {
                await handleCategorizeEmail()
            }

            const response = await fetch(API_ENDPOINTS.REPLIES.GENERATE(id), { method: "POST" })
            if (!response.ok) throw new Error(`Failed to generate reply: ${response.status}`)

            const data = await response.json()
            setReply(data)
            showStatusMessage("Reply generated successfully", "success")
        } catch (error) {
            console.error("Error generating reply:", error)
            setError(`Failed to generate reply: ${error.message}`)
        }
    }

    const handleSendReply = async (editedReply) => {
        const userEmail = localStorage.getItem("userEmail")
        if (!userEmail || !reply?.id) return

        try {
            setError("")
            const response = await fetch(
                `${API_ENDPOINTS.REPLIES.SEND(reply.id)}?userEmail=${encodeURIComponent(userEmail)}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ replyBody: editedReply }),
                }
            )
            if (!response.ok) throw new Error(`Failed to send reply: ${response.status}`)

            showStatusMessage("Reply sent successfully", "success")
            router.push("/emails")
        } catch (error) {
            console.error("Error sending reply:", error)
            setError(`Failed to send reply: ${error.message}`)
        }
    }

    const handleSaveAsDraft = async (editedReply) => {
        const userEmail = localStorage.getItem("userEmail")
        if (!userEmail || !reply?.id) return

        try {
            setError("")
            const response = await fetch(
                `${API_ENDPOINTS.REPLIES.DRAFT(reply.id)}?userEmail=${encodeURIComponent(userEmail)}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ replyBody: editedReply }),
                }
            )
            if (!response.ok) throw new Error(`Failed to save as draft: ${response.status}`)

            showStatusMessage("Reply saved as draft", "success")
            router.push("/emails")
        } catch (error) {
            console.error("Error saving as draft:", error)
            setError(`Failed to save as draft: ${error.message}`)
        }
    }

    const handleCategorizeEmail = async () => {
        try {
            setError("")
            const response = await fetch(API_ENDPOINTS.CATEGORIZE.CATEGORIZE(id), { method: "POST" })
            const data = await response.json()
            setEmail(data)
            showStatusMessage("Email categorized successfully", "success")
        } catch (error) {
            console.error("Error categorizing email:", error)
            setError("Failed to categorize email. Please try again.")
        }
    }

    if (!email) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <div className="card p-6 text-center">
                        <h2 className="text-xl font-bold mb-4">Email Not Found</h2>
                        <p className="mb-4">The email you're looking for doesn't exist or has been deleted.</p>
                        <button className="btn-primary" onClick={() => router.push("/emails")}>
                            Back to Emails
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                {statusMessage && (
                    <div className="fixed top-4 right-4 z-50">
                        <StatusCard message={statusMessage.message} type={statusMessage.type} />
                    </div>
                )}

                <div className="mb-4">
                    <button
                        className="flex items-center text-gray-600 hover:text-gray-900"
                        onClick={() => router.push("/emails")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Emails
                    </button>
                </div>

                {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

                <EmailDetail email={email} />

                {email.status === "NEW" && (
                    <div className="card p-6 mt-6">
                        <h2 className="text-xl font-bold mb-4" style={{ color: "#f59e0b" }}>
                            Categorize Email
                        </h2>
                        <p className="mb-4">
                            This email needs to be categorized before generating a reply.
                        </p>
                        <button className="btn-primary" style={{ backgroundColor: "#f59e0b" }} onClick={handleCategorizeEmail}>
                            Categorize Email
                        </button>
                    </div>
                )}

                {(email.status === "CATEGORIZED" || email.category !== "UNCATEGORIZED") && !reply && (
                    <div className="card p-6 mt-6">
                        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary-color)" }}>
                            Generate Reply
                        </h2>
                        <p className="mb-4">
                            No reply has been generated for this email yet.
                        </p>
                        <button className="btn-primary" onClick={handleGenerateReply}>
                            Generate Reply
                        </button>
                    </div>
                )}

                {reply && <EmailReply reply={reply} onSend={handleSendReply} onSaveAsDraft={handleSaveAsDraft} />}
            </div>
        </DashboardLayout>
    )
}