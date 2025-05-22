"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  averageResolutionTime: number;
}

const StatsDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      try {
        const response = await fetch("/api/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError("Error loading statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-black mb-4">
          System Statistics
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
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
          System Statistics
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-black mb-4">
        System Statistics
      </h2>

      {stats ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Complaints</p>
            <p className="text-2xl font-bold text-black">
              {stats.totalComplaints}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Resolved</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.resolvedComplaints}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pendingComplaints}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.inProgressComplaints}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Average Resolution Time</p>
            <p className="text-2xl font-bold text-black">
              {stats.averageResolutionTime.toFixed(1)} days
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No statistics available yet.</p>
      )}
    </div>
  );
};

export default StatsDashboard;
