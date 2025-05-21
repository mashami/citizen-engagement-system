"use client";

import { useEffect, useState } from "react";

interface StatsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    categories: Array<{
      name: string;
      count: number;
    }>;
  };
}

const DashboardStats: React.FC<StatsProps> = ({ stats }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>;
  }

  // Calculate percentages for the progress bars
  const pendingPercentage =
    stats.total > 0 ? (stats.pending / stats.total) * 100 : 0;
  const inProgressPercentage =
    stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0;
  const resolvedPercentage =
    stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-black mb-6">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Complaints</p>
          <p className="text-3xl font-bold text-black">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600 font-medium">Pending</p>
          <p className="text-3xl font-bold text-black">{stats.pending}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">In Progress</p>
          <p className="text-3xl font-bold text-black">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Resolved</p>
          <p className="text-3xl font-bold text-black">{stats.resolved}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-black mb-4">
          Complaint Status Distribution
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-black">Pending</span>
              <span className="text-sm font-medium text-black">
                {pendingPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{ width: `${pendingPercentage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-black">
                In Progress
              </span>
              <span className="text-sm font-medium text-black">
                {inProgressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-500 h-2.5 rounded-full"
                style={{ width: `${inProgressPercentage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-black">Resolved</span>
              <span className="text-sm font-medium text-black">
                {resolvedPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${resolvedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {stats.categories.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-black mb-4">
            Top Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.categories.map((category, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{category.name}</p>
                <p className="text-xl font-semibold text-black">
                  {category.count}
                </p>
                <p className="text-sm text-gray-500">
                  {stats.total > 0
                    ? ((category.count / stats.total) * 100).toFixed(1)
                    : 0}
                  % of total
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;
