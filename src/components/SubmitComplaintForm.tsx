"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Define the categories available for complaints
const CATEGORIES = [
  "Roads and Infrastructure",
  "Water Supply",
  "Electricity",
  "Waste Management",
  "Public Transport",
  "Healthcare",
  "Education",
  "Public Safety",
  "Environment",
  "Other"
];

// Define the agencies available for routing
const AGENCIES = [
  "Department of Public Works",
  "Water Authority",
  "Electricity Board",
  "Waste Management Department",
  "Transport Authority",
  "Health Department",
  "Education Department",
  "Police Department",
  "Environmental Protection Agency",
  "General Administration"
];

interface FormData {
  title: string;
  description: string;
  category: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  attachments: File[];
}

const SubmitComplaintForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    name: "",
    email: "",
    phone: "",
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ trackingId: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        attachments: Array.from(e.target.files || [])
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Determine the appropriate agency based on the category
      const agencyIndex = CATEGORIES.indexOf(formData.category);
      const agency =
        agencyIndex !== -1
          ? AGENCIES[agencyIndex]
          : AGENCIES[AGENCIES.length - 1];

      // Create form data for file upload
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("location", formData.location);
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("agency", agency);

      formData.attachments.forEach((file) => {
        submitData.append("attachments", file);
      });

      // Convert FormData to a regular object for JSON submission
      const jsonData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        agency: agency
        // We'll handle attachments separately in a real implementation
      };

      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
      });

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      const result = await response.json();
      setSuccess(result);

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        name: "",
        email: "",
        phone: "",
        attachments: []
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Complaint Submitted Successfully!
        </h2>
        <p className="text-green-700 mb-4">
          Your complaint has been received and will be processed by the
          appropriate agency.
        </p>
        <p className="text-green-700 mb-4">
          Your tracking ID is:{" "}
          <span className="font-bold">{success.trackingId}</span>
        </p>
        <p className="text-green-700 mb-6">
          Please save this tracking ID to check the status of your complaint in
          the future.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push(`/track?id=${success.trackingId}`)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Track Your Complaint
          </button>
          <button
            onClick={() => {
              setSuccess(null);
              router.push("/");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-black"
          >
            Complaint Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Brief title of your complaint"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-black"
          >
            Category *
          </label>
          <select
            name="category"
            id="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-black"
        >
          Description *
        </label>
        <textarea
          name="description"
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="Please provide details about your complaint"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-black"
        >
          Location *
        </label>
        <input
          type="text"
          name="location"
          id="location"
          required
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="Address or location related to the complaint"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-black mb-4">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black"
            >
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-black"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="attachments"
          className="block text-sm font-medium text-black"
        >
          Attachments (Optional)
        </label>
        <input
          type="file"
          name="attachments"
          id="attachments"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full text-black"
        />
        <p className="mt-1 text-sm text-gray-500">
          You can upload photos, documents, or other files related to your
          complaint (max 5MB each).
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </div>
    </form>
  );
};

export default SubmitComplaintForm;
