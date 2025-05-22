/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

interface LoginButtonProps {
  session: any;
}

const LoginButton: React.FC<LoginButtonProps> = ({ session }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      {session ? (
        <div>
          <button
            onClick={toggleMenu}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-black hover:bg-gray-100"
          >
            <span>{session.user.email}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={() => signIn()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign in
          </button>
          <Link
            href="/register"
            className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
