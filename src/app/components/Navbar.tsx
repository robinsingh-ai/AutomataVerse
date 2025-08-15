'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useResponsive } from '../context/ResponsiveContext';
import { logoutUser } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

type NavbarProps = {
  onThemeChange: (theme: 'light' | 'dark') => void;
  currentTheme: 'light' | 'dark';
};

const Navbar: React.FC<NavbarProps> = ({ onThemeChange, currentTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const themeColor = '#70D9C2';
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isMobile, isSmallMobile, isDesktop } = useResponsive();

  // Add state to track if we're client-side to prevent hydration errors
  const [isClient, setIsClient] = useState(false);

  // After initial render, mark as client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close mobile menu when screen becomes desktop size (lg breakpoint and above)
  useEffect(() => {
    if (isDesktop && menuOpen) {
      setMenuOpen(false);
    }
  }, [isDesktop, menuOpen]);

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Enhanced menu toggle with animation control
  const toggleMobileMenu = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setMenuOpen(!menuOpen);

    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Close menu with animation
  const closeMobileMenu = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setMenuOpen(false);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      Cookies.remove('authSession');
      router.push('/login');
      closeMobileMenu();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Render auth links only on client side
  const renderAuthLinks = () => {
    // During server render or initial client render before hydration
    if (!isClient) {
      return (
        <>
          <Link href="/signup" className="px-4 py-2 rounded-md text-sm font-medium border border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900 transition-colors text-teal-500 touch-target">
            Sign Up
          </Link>
          <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-opacity-90 transition-colors touch-target" style={{ backgroundColor: themeColor }}>
            Login
          </Link>
        </>
      );
    }

    // After hydration, render based on auth state
    return user ? (
      <>
        <Link href="/profile" className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-500 touch-target">
          Profile
        </Link>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-opacity-90 transition-colors touch-target"
          style={{ backgroundColor: themeColor }}
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link href="/signup" className="px-4 py-2 rounded-md text-sm font-medium border border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900 transition-colors text-teal-500 touch-target">
          Sign Up
        </Link>
        <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-opacity-90 transition-colors touch-target" style={{ backgroundColor: themeColor }}>
          Login
        </Link>
      </>
    );
  };

  // Render mobile auth links only on client side
  const renderMobileAuthLinks = () => {
    // During server render or initial client render before hydration
    if (!isClient) {
      return (
        <>
          <Link
            href="/signup"
            className={`block px-4 py-3 rounded-lg text-base font-medium border border-teal-500 text-teal-500 my-2 touch-target transition-all duration-200 ${currentTheme === 'dark' ? 'hover:bg-teal-500/10' : 'hover:bg-teal-50'
              }`}
            onClick={closeMobileMenu}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Sign Up
            </span>
          </Link>
          <Link
            href="/login"
            className="block px-4 py-3 rounded-lg text-base font-medium text-white my-2 touch-target transition-all duration-200 hover:bg-opacity-90"
            style={{ backgroundColor: themeColor }}
            onClick={closeMobileMenu}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </span>
          </Link>
        </>
      );
    }

    // After hydration, render based on auth state
    return user ? (
      <>
        <Link
          href="/profile"
          className={`block px-4 py-3 rounded-lg text-base font-medium touch-target transition-all duration-200 ${currentTheme === 'dark'
            ? 'text-white hover:text-teal-400 hover:bg-gray-800/50'
            : 'text-gray-900 hover:text-teal-600 hover:bg-gray-100/50'
            }`}
          onClick={closeMobileMenu}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-base font-medium text-white my-2 touch-target transition-all duration-200 hover:bg-opacity-90"
          style={{ backgroundColor: themeColor }}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </span>
        </button>
      </>
    ) : (
      <>
        <Link
          href="/signup"
          className={`block px-4 py-3 rounded-lg text-base font-medium border border-teal-500 text-teal-500 my-2 touch-target transition-all duration-200 ${currentTheme === 'dark' ? 'hover:bg-teal-500/10' : 'hover:bg-teal-50'
            }`}
          onClick={closeMobileMenu}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Sign Up
          </span>
        </Link>
        <Link
          href="/login"
          className="block px-4 py-3 rounded-lg text-base font-medium text-white my-2 touch-target transition-all duration-200 hover:bg-opacity-90"
          style={{ backgroundColor: themeColor }}
          onClick={closeMobileMenu}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login
          </span>
        </Link>
      </>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-800/40 shadow-md transition-colors duration-300 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center touch-target">
              <div className="w-auto relative">
                <Image
                  src="/logo/png/3.png"
                  alt="AutomataVerse"
                  width={isSmallMobile ? 60 : 80}
                  height={isSmallMobile ? 15 : 20}
                  className={`${currentTheme === 'dark' ? 'brightness-200' : ''} object-contain`}
                  priority
                />
              </div>
              <span className={`${isSmallMobile ? 'text-lg' : 'text-xl'} font-medium mr-2`}>
                <span style={{ color: '#70DAC2' }}>Automata</span>
                <span className={`font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Verse</span>
              </span>
            </Link>
          </div>

          {/* Middle Section: Navigation Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            <Link href="/simulator" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-500 touch-target">
              Simulators
            </Link>
            <Link href="/learn" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-500 touch-target">
              Learn
            </Link>
            <Link href="/demo" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-500 touch-target">
              Demo
            </Link>
            <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-500 touch-target">
              About
            </Link>
            <Link href="/#features" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-500 touch-target">
              Features
            </Link>
          </div>

          {/* Right Section: Auth and Theme Toggle */}
          <div className="hidden lg:flex lg:items-center lg:space-x-3">
            <div className="flex items-center space-x-3">
              {renderAuthLinks()}
            </div>
            <button
              onClick={() => onThemeChange(currentTheme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center justify-center p-2 rounded-full touch-target ${
                currentTheme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'
              } hover:text-white transition-colors hover:bg-teal-500`}
              aria-label="Toggle dark mode"
            >
              {currentTheme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button - only visible below lg breakpoint */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMobileMenu}
              disabled={isAnimating}
              className={`relative inline-flex items-center justify-center p-3 rounded-lg touch-target transition-all duration-200 ease-in-out ${currentTheme === 'dark'
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 ${isAnimating ? 'opacity-75' : ''
                }`}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            >
              <span className="sr-only">{menuOpen ? 'Close' : 'Open'} main menu</span>

              {/* Animated hamburger icon */}
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-1'
                    }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out translate-y-2.5 ${menuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${menuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-4'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown with smooth animations */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-16 left-0 right-0 z-40 mobile-nav transition-all duration-300 ease-in-out ${menuOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={closeMobileMenu}
        />

        {/* Menu content */}
        <div className={`relative mx-2 mt-2 rounded-xl shadow-2xl border mobile-safe-area transition-all duration-300 ease-in-out ${currentTheme === 'dark'
          ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-md'
          : 'bg-white/95 border-gray-200/50 backdrop-blur-md'
          } ${menuOpen ? 'scale-100' : 'scale-95'}`}>
          <div className="px-4 py-4 space-y-2">
            {/* Navigation Links */}
            <Link
              href="/simulator"
              className={`block px-4 py-3 rounded-lg text-base font-medium touch-target transition-all duration-200 ${currentTheme === 'dark'
                ? 'text-white hover:text-teal-400 hover:bg-gray-800/50'
                : 'text-gray-900 hover:text-teal-600 hover:bg-gray-100/50'
                }`}
              onClick={closeMobileMenu}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l6-1v13M9 6l6-1" />
                </svg>
                Simulators
              </span>
            </Link>

            <Link
              href="/learn"
              className={`block px-4 py-3 rounded-lg text-base font-medium touch-target transition-all duration-200 ${currentTheme === 'dark'
                ? 'text-white hover:text-teal-400 hover:bg-gray-800/50'
                : 'text-gray-900 hover:text-teal-600 hover:bg-gray-100/50'
                }`}
              onClick={closeMobileMenu}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Learn
              </span>
            </Link>

            <Link
              href="/demo"
              className={`block px-4 py-3 rounded-lg text-base font-medium touch-target transition-all duration-200 ${currentTheme === 'dark'
                ? 'text-white hover:text-teal-400 hover:bg-gray-800/50'
                : 'text-gray-900 hover:text-teal-600 hover:bg-gray-100/50'
                }`}
              onClick={closeMobileMenu}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5V12a1.5 1.5 0 01-1.5 1.5H9m3.5-2v2m0 0V13a1.5 1.5 0 011.5-1.5H15m-1.5 1.5h1.5" />
                </svg>
                Demo
              </span>
            </Link>

            <Link
              href="/about"
              className={`block px-4 py-3 rounded-lg text-base font-medium touch-target transition-all duration-200 ${currentTheme === 'dark'
                ? 'text-white hover:text-teal-400 hover:bg-gray-800/50'
                : 'text-gray-900 hover:text-teal-600 hover:bg-gray-100/50'
                }`}
              onClick={closeMobileMenu}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </span>
            </Link>

            <Link
              href="/#features"
              className={`block px-4 py-3 rounded-lg text-base font-medium touch-target transition-all duration-200 ${currentTheme === 'dark'
                ? 'text-white hover:text-teal-400 hover:bg-gray-800/50'
                : 'text-gray-900 hover:text-teal-600 hover:bg-gray-100/50'
                }`}
              onClick={closeMobileMenu}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Features
              </span>
            </Link>

            {/* Divider */}
            <div className={`my-4 border-t ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />

            {/* Authentication Links */}
            {renderMobileAuthLinks()}

            {/* Theme Toggle */}
            <button
              onClick={() => {
                onThemeChange(currentTheme === 'dark' ? 'light' : 'dark');
                closeMobileMenu();
              }}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-base font-medium touch-target transition-all duration-200 ${currentTheme === 'dark'
                ? 'text-white hover:text-teal-400 hover:bg-gray-800/50'
                : 'text-gray-900 hover:text-teal-600 hover:bg-gray-100/50'
                }`}
            >
              <span className="flex items-center">
                {currentTheme === 'dark' ? (
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 