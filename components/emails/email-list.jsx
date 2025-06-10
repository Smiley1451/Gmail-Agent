"use client"

import { formatDistanceToNow } from "date-fns"

export default function EmailList({ emails, onEmailClick }) {
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

  // Update the status display to match the database enum values
  const getStatusBadge = (status) => {
    let badgeClass = "px-2 py-1 text-xs rounded-full "

    switch (status) {
      case "NEW":
        badgeClass += "bg-yellow-100 text-yellow-800"
        break
      case "CATEGORIZED":
        badgeClass += "bg-blue-100 text-blue-800"
        break
      case "REPLY_GENERATED":
        badgeClass += "bg-purple-100 text-purple-800"
        break
      case "REPLY_SENT":
        badgeClass += "bg-green-100 text-green-800"
        break
      case "REPLY_DRAFTED":
        badgeClass += "bg-indigo-100 text-indigo-800"
        break
      case "IGNORED":
        badgeClass += "bg-gray-100 text-gray-800"
        break
      default:
        badgeClass += "bg-yellow-100 text-yellow-800"
    }

    return <span className={badgeClass}>{status?.toLowerCase().replace("_", " ") || "new"}</span>
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  // Update the table to use the new status badge function
  return (
    <div className="card overflow-hidden mt-6">
      {emails.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No emails found with the selected filter.</p>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onEmailClick(email.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{email.sender?.split("<")[0] || "Unknown"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">{email.subject || "No subject"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getCategoryBadge(email.category)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(email.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(email.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
