import { formatDistanceToNow } from "date-fns"

export default function EmailDetail({ email }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

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

  // Add status badge to the email detail view
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

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--primary-color)" }}>
          {email.subject || "No Subject"}
        </h2>
        <div className="flex space-x-2">
          {email.category && getCategoryBadge(email.category)}
          {email.status && getStatusBadge(email.status)}
        </div>
      </div>

      <div className="flex items-center mb-4 text-gray-600">
        <div>
          <p className="font-medium">From: {email.sender || "Unknown"}</p>
          <p className="text-sm">Received: {formatDate(email.timestamp)}</p>
          {email.processedAt && <p className="text-sm">Processed: {formatDate(email.processedAt)}</p>}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: email.body || "No content" }} />
      </div>
    </div>
  )
}
