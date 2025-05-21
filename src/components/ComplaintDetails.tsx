"use client";

import { useState } from "react";
import { Complaint } from "@prisma/client";

interface ComplaintDetailsProps {
  complaint: Complaint;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint }) => {
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);

  const formatDate = (dateString: Date | string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const truncateDescription = (
    text: string,
    maxLength: number = 200
  ): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">
            {complaint.title}
          </h2>
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
              complaint.status
            )}`}
          >
            {complaint.status.replace("_", " ")}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Tracking ID:{" "}
          <span className="font-medium">{complaint.trackingId}</span>
        </p>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
            <p className="mt-1 text-black">{complaint.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="mt-1 text-black">{complaint.location}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Submitted On</h3>
            <p className="mt-1 text-black">{formatDate(complaint.createdAt)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
            <p className="mt-1 text-black">{complaint.agency}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Description
          </h3>
          <div className="bg-gray-50 p-3 rounded text-black">
            {showFullDescription ? (
              <p>{complaint.description}</p>
            ) : (
              <p>{truncateDescription(complaint.description)}</p>
            )}

            {complaint.description.length > 200 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-2"
              >
                {showFullDescription ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>

        {complaint.response && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Agency Response
            </h3>
            <div className="bg-blue-50 p-3 rounded text-black">
              <p>{complaint.response}</p>
              {complaint.responseDate && (
                <p className="text-sm text-gray-500 mt-2">
                  Responded on: {formatDate(complaint.responseDate)}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4 mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Status Timeline
          </h3>
          <div className="relative">
            <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>

            <div className="relative flex items-start mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center z-10">
                <svg
                  className="h-4 w-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-black">
                  Complaint Submitted
                </h4>
                <p className="text-sm text-gray-500">
                  {formatDate(complaint.createdAt)}
                </p>
              </div>
            </div>

            {complaint.status !== "PENDING" && (
              <div className="relative flex items-start mb-4">
                <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center z-10">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-black">
                    In Progress
                  </h4>
                  <p className="text-sm text-gray-500">
                    {complaint.updatedAt
                      ? formatDate(complaint.updatedAt)
                      : "Date not available"}
                  </p>
                </div>
              </div>
            )}

            {(complaint.status === "RESOLVED" ||
              complaint.status === "REJECTED") && (
              <div className="relative flex items-start">
                <div
                  className={`h-8 w-8 rounded-full ${
                    complaint.status === "RESOLVED"
                      ? "bg-green-500"
                      : "bg-red-500"
                  } flex items-center justify-center z-10`}
                >
                  {complaint.status === "RESOLVED" ? (
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-black">
                    {complaint.status === "RESOLVED" ? "Resolved" : "Rejected"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {complaint.responseDate
                      ? formatDate(complaint.responseDate)
                      : "Date not available"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
