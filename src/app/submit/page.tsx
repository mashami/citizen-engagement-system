import SubmitComplaintForm from "@/components/SubmitComplaintForm";

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h1 className="text-3xl font-bold text-black mb-6">
              Submit a Complaint or Feedback
            </h1>
            <p className="text-lg text-black mb-6">
              Use this form to submit your complaint or feedback about public
              services. Your submission will be routed to the appropriate
              government agency.
            </p>

            <SubmitComplaintForm />
          </div>
        </div>
      </div>
    </main>
  );
}
