'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signInWithGoogle, clearError, clearMessage, signUpWithEmailPassword } from '../../store/authSlice';

const Signup = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [componentError, setComponentError] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, error, message } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setComponentError(error);
    }
  }, [error]);

  useEffect(() => {
    setGoogleLoading(loading);
  }, [loading]);

  const handleGoogleSignIn = async () => {
    try {
      setComponentError('');
      await dispatch(signInWithGoogle()).unwrap();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      if (
        error &&
        typeof error === 'string' &&
        error.includes('auth/popup-closed-by-user')
      ) {
        setComponentError(
          'Sign-in cancelled. You closed the Google login window.'
        );
      } else {
        setComponentError('Failed to sign in with Google. Please try again.');
      }
    }
  };

 const handleManualSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setComponentError("");

  if (password !== confirmPassword) {
    setComponentError("Passwords do not match.");
    return;
  }

  try {
    setManualLoading(true);
    await dispatch(signUpWithEmailPassword({ email, password })).unwrap();
  } catch (err: any) {
    setComponentError(err || "Failed to sign up. Please try again.");
  } finally {
    setManualLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Left side - Illustration/Branding */}
      <div className="md:w-1/2 bg-teal-600 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 mr-2 relative flex items-center justify-center bg-white rounded-full shadow-sm">
                <Image 
                  src="/logo/png/3.png" 
                  alt="AutomataVerse" 
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-2xl font-bold">
                <span>Automata</span>
                <span className="opacity-90">Verse</span>
              </span>
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Join Our Community</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">Create an account to dive into the fascinating world of automata theory and formal languages.</p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Interactive Visualizations</h3>
                <p className="opacity-80">Create and visualize various automata models with our intuitive interface.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Comprehensive Learning</h3>
                <p className="opacity-80">Access educational resources to deepen your understanding of automata theory.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Save & Share</h3>
                <p className="opacity-80">Save your work and share it with others for collaboration and learning.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background patterns */}
        <div className="absolute top-0 right-0 w-full h-full">
          <svg className="absolute right-0 top-0 opacity-10" width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="250" r="250" fill="white" />
            <circle cx="250" cy="250" r="200" stroke="white" strokeWidth="2" />
            <circle cx="250" cy="250" r="150" stroke="white" strokeWidth="2" />
            <circle cx="250" cy="250" r="100" stroke="white" strokeWidth="2" />
            <circle cx="250" cy="250" r="50" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        
        <div className="mt-auto text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} AutomataVerse. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right side - Signup with Google */}
      <div className="md:w-1/2 flex flex-col p-8 md:p-12 justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Or {' '}
              <Link href="/login" className="text-teal-600 hover:text-teal-500 font-medium">
                sign in to your existing account
              </Link>
            </p>
          </div>
          
          {/* Success message */}
          {message && (
            <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-md">
              <p className="font-medium">{message}</p>
            </div>
          )}

          {/* Error message */}
          {componentError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
              <p>{componentError}</p>
            </div>
          )}
           {/* Manual Signup Form */}
          <form onSubmit={handleManualSignup} className="space-y-4 mb-8">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {/* Manual Sign-In/Sign-Up Button */}
              <button
            type="submit"
          disabled={manualLoading}
         className="w-full flex items-center justify-center bg-teal-600 text-white font-medium py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150">
         {manualLoading ? 'Signing up...' : 'Sign Up'}
        </button>
          
         <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Sign up with your Google account</p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center space-x-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 border border-gray-300 rounded-md shadow-sm px-4 py-2 transition duration-150"
              >

                {googleLoading ? (
                  <svg className="animate-spin h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                )}
                <span>{googleLoading ? 'Signing in...' : 'Continue with Google'}</span>
              </button>
            </div>
            </form>
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              By signing up, you agree to our{' '}
              <a href="#" className="text-teal-600 hover:text-teal-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-teal-600 hover:text-teal-500">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </div>
  );
};

export default Signup;