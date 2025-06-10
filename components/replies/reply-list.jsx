"use client"

import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ReplyList({ replies }) {
  const router = useRouter()
  const [expandedReply, setExpandedReply] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  // Update the getStatusBadge function to match the database enum values
  const getStatusBadge = (status) => {
    let badgeClass = "px-2 py-1 text-xs rounded-full "

    switch (status) {
      case "GENERATED":
        badgeClass += "bg-blue-100 text-blue-800"
        break
      case "DRAFTED":
        badgeClass += "bg-yellow-100 text-yellow-800"
        break
      case "SENT":
        badgeClass += "bg-green-100 text-green-800"
        break
      case "FAILED":
        badgeClass += "bg-red-100 text-red-800"
        break
      default:
        badgeClass += "bg-gray-100 text-gray-800"
    }

    return <span className={badgeClass}>{status?.toLowerCase() || "unknown"}</span>
  }

  const toggleExpandReply = (replyId) => {
    if (expandedReply === replyId) {
      setExpandedReply(null)
    } else {
      setExpandedReply(replyId)
    }
  }

  const handleViewEmail = (emailId) => {
    if (emailId) {
      router.push(`/emails/${emailId}`)
    }
  }

  return (
    <div className="card overflow-hidden mt-6">
      {replies.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No replies found with the selected filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reply Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {replies.map((reply) => (
                <>
                  <tr key={reply.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {reply.emailSubject || "No subject"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {reply.replyBody?.substring(0, 50) + "..." || "No content"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(reply.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reply.modelUsed || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(reply.timestamp)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleExpandReply(reply.id)}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                          {expandedReply === reply.id ? "Hide" : "View"}
                        </button>
                        {reply.emailId && (
                          <button
                            onClick={() => handleViewEmail(reply.emailId)}
                            className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                          >
                            Email
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedReply === reply.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="whitespace-pre-wrap text-sm text-gray-700">{reply.replyBody}</div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
