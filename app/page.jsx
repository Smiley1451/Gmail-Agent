"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import LoadingSpinner from "@/components/ui/loading-spinner"
import Image from "next/image"
import { API_ENDPOINTS } from "../app/config/api"

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [requestSent, setRequestSent] = useState(false)
  const [requestEmail, setRequestEmail] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)
  const [activePanel, setActivePanel] = useState("request")
  const [showVideo, setShowVideo] = useState(true)
  const [showComponents, setShowComponents] = useState(true)
  const videoRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      checkAuthStatus(email)
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuthStatus = async (email) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.START}?user_email=${encodeURIComponent(email)}`)
      if (!response.ok) throw new Error(`Failed to check auth status: ${response.status}`)
      const data = await response.json()
      if (data.authenticated) {
        setAuthenticated(true)
        setUserEmail(email)
        router.push("/dashboard")
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      setLoading(false)
    }
  }

  const handleLogin = (email) => {
    setUserEmail(email)
    localStorage.setItem("userEmail", email)
    router.push("/auth")
  }

  const handleRequestAccess = async () => {
    if (!requestEmail) return
    setIsRequesting(true)
    try {
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestEmail }),
      })
      if (response.ok) {
        setRequestSent(true)
        setRequestEmail("")
      } else {
        throw new Error("Failed to send request")
      }
    } catch (error) {
      console.error("Error requesting access:", error)
      alert("Failed to send request. Please try again.")
    } finally {
      setIsRequesting(false)
    }
  }

  const switchPanel = () => {
    const card = document.querySelector(".auth-card")
    if (card) {
      card.classList.add("swapping")
      setTimeout(() => {
        setActivePanel((prev) => (prev === "request" ? "login" : "request"))
        setTimeout(() => {
          card.classList.remove("swapping")
        }, 100)
      }, 400)
    }
  }

  const toggleVideo = () => {
    setShowVideo(!showVideo)
    if (videoRef.current) {
      if (showVideo) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const toggleComponents = () => {
    setShowComponents(!showComponents)
  }



  return (
      <div className="relative min-h-screen">
        {/* Video Background */}
        {showVideo && (
            <div className="fixed inset-0 z-0 overflow-hidden">
              <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  className="absolute w-full h-full object-cover"
              >
                <source src="/bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
        )}

        {/* Control Buttons */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
              onClick={toggleVideo}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white transition-all shadow-md border border-gray-300"
              title={showVideo ? "Hide Background" : "Show Background"}
          >
            {showVideo ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0"></path>
                </svg>
            )}
          </button>
          <button
              onClick={toggleComponents}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white transition-all shadow-md border border-gray-300"
              title={showComponents ? "Hide Components" : "Show Components"}
          >
            {showComponents ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                  <line x1="7" y1="7" x2="7" y2="7.01"></line>
                  <line x1="12" y1="7" x2="12" y2="7.01"></line>
                  <line x1="17" y1="7" x2="17" y2="7.01"></line>
                </svg>
            )}
          </button>
        </div>

        {/* Main Content */}
        <main className="min-h-screen flex flex-col relative z-10">
          {/* App Name Header */}
          <div className="h-[10vh] flex items-center px-8">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full primary-gradient flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--primary-color)" }}>
                MARS-Botics
              </h1>
            </div>
          </div>

          {/* Main Content Area with Transition Containers */}
          <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
            {/* Auth Card Container */}
            <div className={`w-full md:w-[65%] flex flex-col justify-center items-center p-8 transition-slide ${
                showComponents ? 'slide-in-left' : 'slide-out-left'
            }`}>
              <div className="auth-container max-w-md w-full">
                <div className={`auth-card ${activePanel === "login" ? "login-mode" : "request-mode"}`}>
                  <div className="auth-info">
                    <h2>{activePanel === "login" ? "Need access?" : "Already have access?"}</h2>
                    <p>
                      {activePanel === "login" ? "Request access by entering your email" : "Login with your Google account"}
                    </p>
                    <br/>
                    <button onClick={switchPanel} className="switch-btn">
                      {activePanel === "login" ? <u>Request Access</u> : <u>Login</u>}
                    </button>
                  </div>

                  <div className="auth-form">
                    {activePanel === "login" ? (
                        <div className="form">
                          <h2>Login</h2>
                          {requestSent && (
                              <div className="success-message mb-4">Your request was sent! Try logging in now.</div>
                          )}
                          <input
                              type="email"
                              value={userEmail}
                              onChange={(e) => setUserEmail(e.target.value)}
                              placeholder="Enter your email"
                              className="w-full p-3 border rounded-lg mb-4"
                              required
                          />
                          <button onClick={() => handleLogin(userEmail)} className="w-full btn-primary">
                            Continue
                          </button>
                        </div>
                    ) : (
                        <div className="form">
                          <h2>Request Access</h2>
                          {requestSent ? (
                              <div className="success-message">
                                Your request has been sent to the admin. You'll receive an email when you've been added.
                              </div>
                          ) : (
                              <>
                                <input
                                    type="email"
                                    value={requestEmail}
                                    onChange={(e) => setRequestEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full p-3 border rounded-lg mb-4"
                                    required
                                />
                                <button onClick={handleRequestAccess} disabled={isRequesting} className="w-full btn-primary">
                                  {isRequesting ? "Sending Request..." : "Request Access"}
                                </button>
                              </>
                          )}
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Card Container */}
            <div className={`w-full md:w-[35%] flex items-start justify-center p-8 transition-slide ${
                showComponents ? 'slide-in-right' : 'slide-out-right'
            }`}>
              <div className="image-card primary-gradient h-full w-full rounded-2xl flex items-center justify-center p-8">
                <div className="bubble p-8 bg-white/20 backdrop-blur-sm">
                  <Image
                      src="/Home.png"
                      alt="Email Assistant Illustration"
                      width={400}
                      height={400}
                      className="max-w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}