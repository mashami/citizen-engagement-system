import { notFound } from "next/navigation";
import Link from "next/link";
import ComplaintDetails from "@/components/ComplaintDetails";

interface ComplaintPageProps {
  params: {
    id: string;
  };
}

export default async function ComplaintPage({ params }: ComplaintPageProps) {
  const { id } = params;

  // Fetch the complaint details
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/complaints/${id}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    notFound();
  }

  const complaint = await response.json();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
                className="h-5 w-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-black mb-6">
            Complaint Details
          </h1>

          <ComplaintDetails complaint={complaint} />
        </div>
      </div>
    </main>
  );
}
