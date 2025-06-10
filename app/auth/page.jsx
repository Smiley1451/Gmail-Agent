"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ErrorMessage from "@/components/ui/error-message"
import { API_ENDPOINTS } from "../config/api"
import Image from "next/image"

export default function AuthPage() {
  const [authUrl, setAuthUrl] = useState("")
  const [error, setError] = useState("")
  const [authStatus, setAuthStatus] = useState({
    authenticated: false,
    message: "",
  })
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const router = useRouter()

  // deep
  useEffect(() => {
    const authCard = document.querySelector('.auth-card');

    if (authCard) {
      const handleMouseMove = (e) => {
        const rect = authCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        authCard.style.setProperty('--mouse-x', `${x}px`);
        authCard.style.setProperty('--mouse-y', `${y}px`);
      };

      authCard.addEventListener('mousemove', handleMouseMove);
      return () => authCard.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);
  // deep

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      router.push("/")
      return
    }
    startAuth(userEmail)
  }, [router])

  const startAuth = async (userEmail) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.START}?user_email=${encodeURIComponent(userEmail)}`)
      if (!response.ok) throw new Error(`Authentication failed with status: ${response.status}`)

      const data = await response.json()
      if (data.authenticated) {
        localStorage.setItem("userEmail", data.userEmail)
        router.push("/dashboard")
        return
      }
      if (data.authUrl) {
        setAuthUrl(data.authUrl)
        setAuthStatus({
          authenticated: false,
          message: data.message || "Please visit the authorization URL to grant access",
        })
      } else {
        setError("Failed to start authentication process")
      }
    } catch (error) {
      console.error("Error starting auth:", error)
      setError(`An error occurred: ${error.message}`)
    }
  }

  const checkAuthStatus = async () => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) return
    try {
      setIsCheckingStatus(true)
      const response = await fetch(`${API_ENDPOINTS.AUTH.STATUS}?user_email=${encodeURIComponent(userEmail)}`)
      if (!response.ok) throw new Error(`Failed to check auth status: ${response.status}`)

      const data = await response.json()
      if (data.authenticated) {
        setAuthStatus({
          authenticated: true,
          message: data.message || "Authentication successful",
        })
        setTimeout(() => router.push("/dashboard"), 2000)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      setError(`Failed to verify authentication: ${error.message}`)
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const handleAuthClick = () => {
    setIsAuthorizing(true)
    window.open(authUrl, "_blank", "width=600,height=700")
    const interval = setInterval(async () => {
      await checkAuthStatus()
      if (authStatus.authenticated) clearInterval(interval)
    }, 3000)
    setTimeout(() => {
      clearInterval(interval)
      setIsAuthorizing(false)
    }, 120000)
  }

  return (
      <main className="min-h-screen flex flex-col">
        {/* App Name Header - Top 10% */}
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

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Auth Card - 65% width */}
          <div className="w-full md:w-[65%] flex flex-col justify-center items-center p-8">
            <div className="auth-container max-w-md w-full">
              <div className={`auth-card ${authStatus.authenticated ? "success-mode" : "auth-mode"}`}>
                <div className="auth-info">
                  <h2>{authStatus.authenticated ? "Authentication Complete!" : "Gmail Authentication"}</h2>
                  <p>
                    {authStatus.authenticated
                        ? "You'll be redirected shortly"
                        : "Connect your Gmail account to get started"}
                  </p>
                  <button
                      onClick={() => router.push("/")}
                      className="switch-btn mt-4"
                  >
                    Back to Login
                  </button>
                </div>

                <div className="auth-form">
                  {error ? (
                      <ErrorMessage message={error} onDismiss={() => setError("")} />
                  ) : authStatus.authenticated ? (
                      <div className="success-message">
                        <p>{authStatus.message}</p>
                        <div className="flex justify-center mt-6">
                          <div className="loading-spinner"></div>
                        </div>
                        <p className="mt-4 text-center text-sm">Redirecting to dashboard...</p>
                      </div>
                  ) : (
                      <div className="form">
                        <h2>Authorize Access</h2>
                        <p className="mb-6">
                          {authStatus.message ||
                              "Click below to authorize access to your Gmail account"}
                        </p>
                        <button
                            onClick={handleAuthClick}
                            className="w-full btn-primary"
                            disabled={isAuthorizing || isCheckingStatus}
                        >
                          {isAuthorizing ? "Opening Authorization..." :
                              isCheckingStatus ? "Checking Status..." :
                                  "Authorize Gmail Access"}
                        </button>
                        <p className="mt-6 text-sm text-gray-600 text-center">
                          You'll be redirected to Google's authentication page.
                        </p>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Image Card - 35% width */}
          <div className="w-full md:w-[35%] flex items-start justify-center p-8">
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
  )
}