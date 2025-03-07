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
import { getUserMachines, SavedMachine } from "../../lib/machineService";
import { Timestamp } from "firebase/firestore";
import { listenToUserMachines } from "../../lib/machineService";

// Machine details modal
interface MachineModalProps {
  machine: SavedMachine | null;
  isOpen: boolean;
  onClose: () => void;
}

const MachineDetailsModal: React.FC<MachineModalProps> = ({ machine, isOpen, onClose }) => {
  const { theme } = useTheme();
  const router = useRouter();
  
  if (!machine || !isOpen) return null;
  
  // Format timestamp to readable date
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) return "Unknown date";
    
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Navigate to the machine
  const openMachine = () => {
    window.open(machine.machineUrl.startsWith('http') 
      ? machine.machineUrl 
      : `${window.location.origin}${machine.machineUrl}`, 
      '_blank'
    );
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      <div className={`relative rounded-lg shadow-lg w-full max-w-md p-6 ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold pr-8">{machine.title}</h3>
          <button
            onClick={onClose}
            className={`rounded-full p-1 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center`}>
            {/* Machine type icon */}
            <div className="mr-3">
              {machine.machineType.includes('Turing') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              ) : machine.machineType.includes('Pushdown') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              ) : machine.machineType.includes('Non-deterministic') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
              ) : machine.machineType.includes('Deterministic') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : machine.machineType.includes('Moore') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              ) : machine.machineType.includes('Mealy') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {machine.machineType}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className={`text-sm mb-1 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Description:</p>
          <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-sm">
              {machine.description || "No description provided."}
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Created: {formatDate(machine.createdAt)}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Close
          </button>
          <button
            onClick={openMachine}
            className={`px-4 py-2 rounded flex items-center ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <span>Open Machine</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

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
  
  // Machine details modal
  const [selectedMachine, setSelectedMachine] = useState<SavedMachine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // User's saved machines
  const [savedMachines, setSavedMachines] = useState<SavedMachine[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for error handling
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Use real-time listener for saved machines
    let unsubscribe: (() => void) | undefined;
    
    if (user?.uid) {
      setIsLoading(true);
      setError(null); // Reset error state when fetching
      
      try {
        // Set up real-time listener for machines
        unsubscribe = listenToUserMachines(user.uid, (machines) => {
          setSavedMachines(machines);
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error setting up machines listener:', error);
        setIsLoading(false);
        // Set friendly error message
        setError('There was a problem loading your machines. Please try again later.');
      }
    }
    
    // Clean up listener when component unmounts or user changes
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  // Stats section data with real counts
  const stats = [
    { name: "Automata Created", value: savedMachines.length.toString() },
    { name: "Simulations Run", value: "0" },  // We'll update this with real data later
    { name: "Saved Projects", value: savedMachines.length.toString() },
  ];
  
  // Format date for display
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) return "Unknown date";
    
    const now = new Date();
    const date = timestamp.toDate();
    
    // Calculate difference in milliseconds
    const diff = now.getTime() - date.getTime();
    
    // Convert to days
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };
  
  // Open machine details modal
  const openMachineDetails = (machine: SavedMachine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

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

        {/* Saved Machines */}
        <div
          className={`mt-6 rounded-lg shadow overflow-hidden ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Saved Machines
              </h2>
              {!isLoading && !error && (
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {savedMachines.length} {savedMachines.length === 1 ? 'machine' : 'machines'} saved
                </p>
              )}
            </div>
          </div>
          
          {error ? (
            <div className="p-6 text-center">
              <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-500'} mb-2`}>
                {error}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                If this persists, an index might need to be created in Firestore. Please contact the administrator.
              </p>
            </div>
          ) : isLoading ? (
            <div className="p-6 text-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading your saved machines...
              </p>
            </div>
          ) : savedMachines.length === 0 ? (
            <div className="p-6 text-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                You haven't saved any machines yet. Create and save a machine to see it here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {savedMachines.map((machine) => (
                <div 
                  key={machine.id} 
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => openMachineDetails(machine)}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-2 rounded-full ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      } mr-4`}
                    >
                      {/* Different icons based on machine type */}
                      {machine.machineType.includes('Turing') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                      ) : machine.machineType.includes('Pushdown') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                      ) : machine.machineType.includes('Non-deterministic') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                      ) : machine.machineType.includes('Deterministic') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : machine.machineType.includes('Moore') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                        </svg>
                      ) : machine.machineType.includes('Mealy') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 7H7v6h6V7z" />
                          <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        <span className="font-semibold">{machine.title}</span>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {machine.machineType} • {formatDate(machine.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Machine details modal */}
      <MachineDetailsModal
        machine={selectedMachine}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
