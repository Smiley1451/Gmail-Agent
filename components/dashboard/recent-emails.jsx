"use client"

import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

export default function RecentEmails({ emails }) {
  const router = useRouter()

  // Update the getCategoryBadge function to match the database enum values
  const getCategoryBadge = (category) => {
    let badgeClass = "badge "

    switch (category) {
      case "SPAM":
        badgeClass += "bg-red-500"
        break
      case "BUSINESS_QUERY":
        badgeClass += "bg-blue-500"
        break
      case "COMPLAINT":
        badgeClass += "bg-orange-500"
        break
      case "ENQUIRY":
        badgeClass += "bg-purple-500"
        break
      case "FEEDBACK":
        badgeClass += "bg-green-500"
        break
      case "UNCATEGORIZED":
      default:
        badgeClass += "bg-gray-500"
    }

    return <span className={badgeClass}>{category?.toLowerCase().replace("_", " ") || "uncategorized"}</span>
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4">Recent Emails</h2>

      <div className="card overflow-hidden">
        {emails.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No emails found. Sync your emails to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Received
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emails.map((email) => (
                  <tr
                    key={email.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/emails/${email.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {email.sender?.split("<")[0] || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs">{email.subject || "No subject"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getCategoryBadge(email.category)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(email.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
