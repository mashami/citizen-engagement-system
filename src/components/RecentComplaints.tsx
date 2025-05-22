"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Complaint {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
}

const RecentComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentComplaints = async (): Promise<void> => {
      try {
        const response = await fetch("/api/complaints/recent");

        if (!response.ok) {
          throw new Error("Failed to fetch recent complaints");
        }

        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        setError("Error loading recent complaints");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentComplaints();
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-black mb-4">
          Recent Complaints
        </h2>
        <div className="animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="mb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-black mb-4">
          Recent Complaints
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-black mb-4">
        Recent Complaints
      </h2>

      {complaints.length === 0 ? (
        <p className="text-gray-500">No complaints submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="border-b border-gray-200 pb-3 last:border-0"
            >
              <h3 className="font-medium text-black">{complaint.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  {complaint.category}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    complaint.status
                  )}`}
                >
                  {complaint.status}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/track"
        className="block text-blue-600 text-sm mt-4 hover:underline"
      >
        View all complaints →
      </Link>
    </div>
  );
};

export default RecentComplaints;
