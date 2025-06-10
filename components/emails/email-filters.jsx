"use client"

export default function EmailFilters({ activeFilter, onFilterChange }) {
  const filters = [
    { id: "all", name: "All Emails" },
    { id: "new", name: "New" },
    { id: "categorized", name: "Categorized" },
    { id: "reply_generated", name: "Reply Generated" },
    { id: "reply_sent", name: "Reply Sent" },
    { id: "reply_drafted", name: "Reply Drafted" },
    { id: "ignored", name: "Ignored" },
  ]

  const categoryFilters = [
    { id: "spam", name: "Spam" },
    { id: "business_query", name: "Business Query" },
    { id: "complaint", name: "Complaint" },
    { id: "enquiry", name: "Enquiry" },
    { id: "feedback", name: "Feedback" },
    { id: "uncategorized", name: "Uncategorized" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Status</h3>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === filter.id
                  ? "bg-primary-gradient text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              style={
                activeFilter === filter.id
                  ? { background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))" }
                  : {}
              }
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((filter) => (
            <button
              key={filter.id}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === filter.id
                  ? "bg-primary-gradient text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              style={
                activeFilter === filter.id
                  ? { background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))" }
                  : {}
              }
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
