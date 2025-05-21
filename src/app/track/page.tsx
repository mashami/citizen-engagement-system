import TrackComplaintForm from "@/components/TrackComplaintForm";

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h1 className="text-3xl font-bold text-black mb-6">
              Track Your Complaint
            </h1>
            <p className="text-lg text-black mb-6">
              Enter your tracking ID to check the status of your complaint.
            </p>

            <TrackComplaintForm />
          </div>
        </div>
      </div>
    </main>
  );
}
