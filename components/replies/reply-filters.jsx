"use client"

export default function ReplyFilters({ activeFilter, onFilterChange }) {
  const filters = [
    { id: "generated", name: "Generated" },
    { id: "drafted", name: "Drafted" },
    { id: "sent", name: "Sent" },
    { id: "failed", name: "Failed" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeFilter === filter.id ? "bg-primary-gradient text-white" : "bg-white text-gray-700 hover:bg-gray-100"
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
  )
}
