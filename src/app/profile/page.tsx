"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutUser } from "../store/authSlice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Create a client-only component for the profile picture to avoid hydration issues
const ProfilePicture = dynamic(
  () =>
    Promise.resolve(({ user }: { user: any }) => {
      return user?.photoURL ? (
        <Image
          src={user.photoURL}
          alt={user.displayName || "User"}
          width={128}
          height={128}
          className="h-full w-full object-cover"
          onError={(e) => {
            // If image fails to load, replace with default avatar
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.style.display = "none"; // Hide the image
            // The parent div already has the SVG fallback that will show
          }}
          unoptimized={true} // Skip Next.js image optimization for external URLs
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 dark:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      );
    }),
  { ssr: false }
);

// Create a client-only component for user information to avoid hydration issues
const UserInfo = dynamic(
  () =>
    Promise.resolve(({ user }: { user: any }) => {
      return (
        <>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.displayName || "User"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Member since{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </>
      );
    }),
  { ssr: false }
);

// Create a client-only component for contact information to avoid hydration issues
const ContactInfo = dynamic(
  () =>
    Promise.resolve(({ user, isDark }: { user: any; isDark: boolean }) => {
      return (
        <div
          className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Contact Information
          </h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                {user?.email || "email@example.com"}
              </span>
            </div>
           
          </div>
        </div>
      );
    }),
  { ssr: false }
);

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const themeColor = "#70D9C2";
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get user data from Redux store
  const { user } = useAppSelector((state) => state.auth);

  // Client-side only flag to prevent hydration issues
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Stats section data
  const stats = [
    { name: "Automata Created", value: "12" },
    { name: "Simulations Run", value: "47" },
    { name: "Saved Projects", value: "8" },
   
  ];

  // Mock user activities - in a real app, this would come from a database
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "Created",
      name: "DFA for even binary numbers",
      date: "2 days ago",
    },
    {
      id: 2,
      type: "Modified",
      name: "NFA with epsilon transitions",
      date: "1 week ago",
    },
    { id: 3, type: "Shared", name: "PDA for palindromes", date: "2 weeks ago" },
  ]);

  // // Mock user interests - in a real app, this would be stored in the user's profile
  // const [interests, setInterests] = useState([
  //   "Finite Automata",
  //   "Turing Machines",
  //   "Formal Languages",
  //   "Algorithm Design",
  // ]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      Cookies.remove("authSession");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Fixed Header */}
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />

      {/* Profile Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-teal-500 to-blue-500">
            {/* Profile picture overlay */}
            <div className="absolute -bottom-16 left-6 sm:left-8">
              <div
                className={`h-32 w-32 rounded-full border-4 ${
                  isDark ? "border-gray-800" : "border-white"
                } overflow-hidden`}
              >
                <div className="bg-gray-300 dark:bg-gray-600 h-full w-full flex items-center justify-center">
                  <ProfilePicture user={user} />
                </div>
              </div>
            </div>

            {/* Logout button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-6 px-6 sm:px-8">
            <div className="flex flex-wrap justify-between items-start">
              <div className="w-full md:w-7/12">
                {isClient ? (
                  <UserInfo user={user} />
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      User
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Member since{" "}
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </>
                )}
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  Enthusiast in automata theory and formal languages. I love
                  exploring computational models and solving complex problems.
                </p>

                {/* <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Interests
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div> */}
              </div>

              <div className="w-full md:w-4/12 mt-6 md:mt-0">
                {isClient ? (
                  <ContactInfo user={user} isDark={isDark} />
                ) : (
                  <div
                    className={`p-4 rounded-lg ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Contact Information
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">
                          email@example.com
                        </span>
                      </div>
                      
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          } gap-4 sm:gap-6 mt-6`}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow text-center ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.name}
              </p>
              <p
                className="mt-2 text-3xl font-semibold"
                style={{ color: themeColor }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div
          className={`mt-6 rounded-lg shadow overflow-hidden ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-6">
                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-full ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    } mr-4`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-teal-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {activity.type}{" "}
                      <span className="font-semibold">{activity.name}</span>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {activity.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Projects or Recommended Learning
        <div
          className={`mt-6 rounded-lg shadow ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recommended Learning
            </h2>
            <Link
              href="/learn"
              className="text-sm font-medium hover:underline"
              style={{ color: themeColor }}
            >
              View All
            </Link>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-lg border ${
                isDark ? "border-gray-700 bg-gray-700" : "border-gray-200"
              }`}
            >
              <h3 className="font-medium text-gray-900 dark:text-white">
                Advanced Turing Machines
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Learn about multi-tape Turing machines and their applications
              </p>
              <button
                className="mt-3 text-white px-3 py-1 rounded text-sm font-medium"
                style={{ backgroundColor: themeColor }}
              >
                Start Learning
              </button>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                isDark ? "border-gray-700 bg-gray-700" : "border-gray-200"
              }`}
            >
              <h3 className="font-medium text-gray-900 dark:text-white">
                Context-Free Languages
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Explore the properties and applications of context-free
                languages
              </p>
              <button
                className="mt-3 text-white px-3 py-1 rounded text-sm font-medium"
                style={{ backgroundColor: themeColor }}
              >
                Start Learning
              </button>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                isDark ? "border-gray-700 bg-gray-700" : "border-gray-200"
              }`}
            >
              <h3 className="font-medium text-gray-900 dark:text-white">
                Recursive and Recursively Enumerable Languages
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Understand the hierarchy of formal languages
              </p>
              <button
                className="mt-3 text-white px-3 py-1 rounded text-sm font-medium"
                style={{ backgroundColor: themeColor }}
              >
                Start Learning
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
