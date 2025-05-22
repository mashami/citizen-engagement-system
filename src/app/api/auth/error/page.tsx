"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const AuthError: React.FC = () => {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const [errorMessage, setErrorMessage] = useState<string>(
    "An authentication error occurred"
  );

  useEffect(() => {
    if (error) {
      switch (error) {
        case "Configuration":
          setErrorMessage("There is a problem with the server configuration.");
          break;
        case "AccessDenied":
          setErrorMessage("You do not have permission to sign in.");
          break;
        case "Verification":
          setErrorMessage(
            "The verification link may have been used or is no longer valid."
          );
          break;
        case "OAuthSignin":
        case "OAuthCallback":
        case "OAuthCreateAccount":
        case "EmailCreateAccount":
        case "Callback":
          setErrorMessage(
            "There was a problem with the authentication provider."
          );
          break;
        case "OAuthAccountNotLinked":
          setErrorMessage(
            "This email is already associated with another account."
          );
          break;
        case "EmailSignin":
          setErrorMessage("The email could not be sent.");
          break;
        case "CredentialsSignin":
          setErrorMessage("The email or password you entered is incorrect.");
          break;
        case "SessionRequired":
          setErrorMessage("You must be signed in to access this page.");
          break;
        default:
          setErrorMessage("An unexpected authentication error occurred.");
          break;
      }
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="mt-2 text-xl font-bold text-black">
              Authentication Error
            </h2>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
          </div>

          <div className="mt-6 flex flex-col space-y-4">
            <Link
              href="/api/auth/signin"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try signing in again
            </Link>
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to home page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthError;
