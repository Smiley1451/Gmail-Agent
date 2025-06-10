export default function EmailStats({ stats }) {
  const statItems = [
    { name: "New Emails", value: stats.new || 0, color: "#f59e0b" },
    { name: "Categorized", value: stats.categorized || 0, color: "var(--primary-color)" },
    { name: "Replies Generated", value: stats.replyGenerated || 0, color: "var(--secondary-color)" },
    { name: "Replies Sent", value: stats.replySent || 0, color: "#10b981" },
  ]

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4">Email Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div key={item.name} className="card p-4">
            <div className="flex items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.value}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">{item.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
