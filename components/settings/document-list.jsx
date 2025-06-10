"use client"

import { formatDistanceToNow } from "date-fns"

export default function DocumentList({ documents, onVectorize, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Not yet"
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  return (
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary-color)" }}>
          Business Documents
        </h2>

        {documents.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No documents available.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vectorized
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {doc.fileName || "Business Document"}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(doc.uploadedAt)}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {doc.vectorized ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Yes</span>
                        ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">No</span>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex gap-2">
                          {!doc.vectorized && (
                              <button
                                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                  onClick={() => onVectorize(doc.id)}
                              >
                                Vectorize
                              </button>
                          )}
                          <button
                              className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                              onClick={() => onDelete(doc.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  )
}