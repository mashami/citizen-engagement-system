"use client";

import { useState } from "react";
import { Complaint } from "@prisma/client";
import ComplaintResponseModal from "./ComplaintResponseModal";

interface ComplaintListProps {
  complaints: Complaint[];
  onStatusUpdate: (
    complaintId: string,
    newStatus: string,
    response?: string
  ) => Promise<boolean>;
}

const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
  onStatusUpdate
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"resolve" | "reject" | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleActionClick = (
    complaint: Complaint,
    action: "resolve" | "reject"
  ) => {
    setSelectedComplaint(complaint);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
    setActionType(null);
  };

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    setLoading(true);
    try {
      const success = await onStatusUpdate(complaintId, newStatus);
      if (success) {
        setIsModalOpen(false);
        setSelectedComplaint(null);
        setActionType(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmit = async (response: string) => {
    if (!selectedComplaint || !actionType) return;

    setLoading(true);
    try {
      const newStatus = actionType === "resolve" ? "RESOLVED" : "REJECTED";
      const success = await onStatusUpdate(
        selectedComplaint.id,
        newStatus,
        response
      );
      if (success) {
        setIsModalOpen(false);
        setSelectedComplaint(null);
        setActionType(null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (complaints.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">
          No complaints found matching the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
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
                Agency
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
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  {complaint.trackingId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  <div className="flex flex-col">
                    <span className="font-medium">{complaint.title}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {complaint.name} • {complaint.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {complaint.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {complaint.agency}
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
                        : complaint.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {complaint.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        window.open(`/complaints/${complaint.id}`, "_blank")
                      }
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>

                    {complaint.status === "PENDING" && (
                      <button
                        onClick={() =>
                          handleStatusChange(complaint.id, "IN_PROGRESS")
                        }
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Start
                      </button>
                    )}

                    {(complaint.status === "PENDING" ||
                      complaint.status === "IN_PROGRESS") && (
                      <>
                        <button
                          onClick={() =>
                            handleActionClick(complaint, "resolve")
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleActionClick(complaint, "reject")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedComplaint && (
        <ComplaintResponseModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          complaint={selectedComplaint}
          actionType={actionType}
          onSubmit={handleResponseSubmit}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default ComplaintList;
