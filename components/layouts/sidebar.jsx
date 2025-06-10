"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function Sidebar({ userEmail }) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeHover, setActiveHover] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "Emails",
      path: "/emails",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      name: "Replies",
      path: "/replies",
      icon: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  // CSS-in-JS styles
  const styles = `
    .sidebar {
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
      box-shadow: 5px 0 15px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      border-right: 1px solid rgba(0, 0, 0, 0.05);
      width: 260px;
      z-index: 40;
    }
    
    .sidebar:hover {
      box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
    }
    
    .primary-gradient {
      background: linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335);
      background-size: 300% 300%;
      animation: gradientBG 8s ease infinite;
    }
    
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .sidebar-item {
      position: relative;
      color: #5f6368;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      margin: 0 8px;
    }
    
    .sidebar-item:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(66, 133, 244, 0.1), transparent);
      transition: all 0.6s ease;
    }
    
    .sidebar-item:hover {
      background-color: rgba(66, 133, 244, 0.08);
      color: #202124;
      transform: translateX(5px);
    }
    
    .sidebar-item:hover:before {
      left: 100%;
    }
    
    .sidebar-item.active {
      background-color: rgba(66, 133, 244, 0.12);
      color: #1a73e8;
      font-weight: 500;
    }
    
    .sidebar-item.active svg {
      stroke: #1a73e8;
    }
    
    .user-email-box {
      background: linear-gradient(to right, rgba(255,255,255,0.9), rgba(245,247,250,0.9));
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255,255,255,0.3);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      transition: all 0.3s ease;
      margin: 0 8px;
    }
    
    .user-email-box:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    .logout-btn {
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      margin: 0 8px;
    }
    
    .logout-btn:after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(234, 67, 53, 0.1), transparent);
      transition: all 0.6s ease;
    }
    
    .logout-btn:hover {
      color: #ea4335;
      transform: translateX(5px);
    }
    
    .logout-btn:hover:after {
      left: 100%;
    }
    
    .nav-icon {
      transition: transform 0.3s ease;
    }
    
    .sidebar-item:hover .nav-icon {
      transform: scale(1.1);
    }
    
    @media (max-width: 768px) {
      .sidebar {
        width: 260px;
      }
      .sidebar-item span {
        display: inline;
      }
      .sidebar-item {
        justify-content: flex-start;
        padding: 12px 16px;
      }
      .sidebar-item svg {
        margin-right: 12px;
      }
      .brand-text, .user-email-box span:first-child {
        display: block;
      }
    }
  `

  return (
      <div className="sidebar h-full flex flex-col justify-between">
        {/* Inject styles */}
        <style dangerouslySetInnerHTML={{ __html: styles }} />

        <div>
          <div className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full primary-gradient flex items-center justify-center text-white font-bold">
              GA
            </div>
            <div className="ml-3">
              <h2 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
                MARS-Botics
              </h2>
            </div>
          </div>

          <div className="px-4 py-2">
            <div className="user-email-box rounded-lg p-3 text-sm">
              <span className="block font-medium text-gray-500">Signed in as:</span>
              <span className="block truncate text-gray-700 font-medium">{isClient ? userEmail : 'Loading...'}</span>
            </div>
          </div>

          <nav className="mt-6 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item, index) => (
                  <li key={item.name}>
                    <a
                        href={item.path}
                        className={`sidebar-item flex items-center px-4 py-3 text-sm font-medium ${pathname === item.path ? "active" : ""}`}
                        onClick={(e) => {
                          e.preventDefault()
                          router.push(item.path)
                        }}
                        onMouseEnter={() => setActiveHover(index)}
                        onMouseLeave={() => setActiveHover(null)}
                    >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`nav-icon h-5 w-5 mr-3 ${activeHover === index ? 'text-blue-500' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span>{item.name}</span>
                      {pathname === item.path && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      )}
                    </a>
                  </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
              className="logout-btn flex items-center text-gray-500 hover:text-red-500 text-sm font-medium w-full px-3 py-2 rounded-md"
              onClick={handleLogout}
          >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
  )
}