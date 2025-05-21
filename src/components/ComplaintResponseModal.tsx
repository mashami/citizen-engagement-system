"use client";

import { useState } from "react";
import { Complaint } from "@prisma/client";

interface ComplaintResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint;
  actionType: "resolve" | "reject" | null;
  onSubmit: (response: string) => void;
  isLoading: boolean;
}

const ComplaintResponseModal: React.FC<ComplaintResponseModalProps> = ({
  isOpen,
  onClose,
  complaint,
  actionType,
  onSubmit,
  isLoading
}) => {
  const [response, setResponse] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(response);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-black">
            {actionType === "resolve"
              ? "Resolve Complaint"
              : "Reject Complaint"}
          </h3>
        </div>

        <div className="px-6 py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Complaint
            </h4>
            <p className="text-black font-medium">{complaint.title}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Tracking ID
            </h4>
            <p className="text-black">{complaint.trackingId}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="response"
                className="block text-sm font-medium text-black mb-1"
              >
                Response to Citizen
              </label>
              <textarea
                id="response"
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder={
                  actionType === "resolve"
                    ? "Explain how the complaint was resolved..."
                    : "Explain why the complaint was rejected..."
                }
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  actionType === "resolve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={isLoading}
              >
                {isLoading
                  ? "Submitting..."
                  : actionType === "resolve"
                  ? "Resolve Complaint"
                  : "Reject Complaint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintResponseModal;
