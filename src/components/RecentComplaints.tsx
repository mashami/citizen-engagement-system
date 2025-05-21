"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Complaint } from "@prisma/client";

interface RecentComplaintsProps {
  complaints: Complaint[];
}

const RecentComplaints: React.FC<RecentComplaintsProps> = ({ complaints }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse h-40 bg-gray-200 rounded"></div>;
  }

  if (complaints.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No complaints have been submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                {complaint.trackingId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                <Link
                  href={`/complaints/${complaint.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  {complaint.title}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                {complaint.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    complaint.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : complaint.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : complaint.status === "RESOLVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {complaint.status.replace("_", " ")}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <Link
          href="/complaints"
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          View all complaints →
        </Link>
      </div>
    </div>
  );
};

export default RecentComplaints;
