"use client";

import Link from "next/link";
import { useState } from "react";
import AutomataBanner from "./components/AutomataBanner";
import Navbar from "./components/Navbar";
import { useResponsive } from "./context/ResponsiveContext";
import { useTheme } from "./context/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { isMobile, isSmallMobile } = useResponsive();
  const isDark = theme === "dark";
  const themeColor = "#70D9C2";
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div
      className={`overflow-auto ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Fixed Header */}
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />

      {/* Floating Feedback Button - Hidden on small mobile */}
      {!isSmallMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdmNyVJTWUU7G5W7Zxu6jX9NPHWoz4g82x67UEvc-y-0SaXkw/viewform?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-white transition-all duration-300 hover:scale-105 touch-target"
            style={{ backgroundColor: themeColor }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span className={isMobile ? "text-sm" : "text-base"}>Feedback</span>
          </a>
        </div>
      )}

      {/* Hero Section */}
      <div className="pt-16">
        {/* Announcement Banner */}
        {showBanner && (
          <div className="bg-red-500 text-white p-3 relative mb-6 mx-4 sm:mx-6 lg:mx-8 rounded">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <span
                className={`font-medium ${isMobile ? "text-sm" : "text-base"}`}
              >
                Added new problem sets for DFA in learning section
              </span>

              <button
                onClick={() => setShowBanner(false)}
                className="absolute right-4 top-3 text-white hover:text-gray-200 touch-target"
                aria-label="Close banner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-wrap lg:flex-nowrap items-center">
          <div className="w-full lg:w-1/2 lg:pr-8">
            <div
              className={`mb-8 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                isDark
                  ? "bg-opacity-20 bg-teal-600 text-teal-200"
                  : "bg-teal-100 text-teal-800"
              }`}
              style={{
                backgroundColor: isDark
                  ? "rgba(112, 217, 194, 0.2)"
                  : "rgba(112, 217, 194, 0.2)",
              }}
            >
              Interactive Automata Simulation
            </div>
            <h1
              className={`${
                isMobile ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
              } font-bold mb-6`}
            >
              Dive into the world of{" "}
              <span style={{ color: themeColor }}>Automata Theory</span> for
              free!
            </h1>
            <p
              className={`${isMobile ? "text-base" : "text-lg"} mb-8 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              From simple finite automata to complex Turing machines, plot state
              diagrams, test input strings, and explore the foundations of
              theoretical computer science.
            </p>
            <div
              className={`flex ${
                isMobile ? "flex-col gap-3" : "flex-wrap gap-4"
              }`}
            >
              <Link
                href="/simulator"
                className={`${
                  isMobile ? "w-full text-center" : ""
                } px-8 py-3 text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors touch-target`}
                style={{ backgroundColor: themeColor }}
              >
                Launch Simulator
              </Link>
              <Link
                href="/getting-started"
                className={`${
                  isMobile ? "w-full text-center" : ""
                } px-8 py-3 rounded-lg font-medium border transition-colors touch-target ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
                    : "bg-white text-gray-800 hover:bg-gray-100 border-gray-300"
                }`}
              >
                Learn More
              </Link>
            </div>
          </div>
          <div
            className={`w-full lg:w-1/2 ${isMobile ? "mt-8" : "mt-12 lg:mt-0"}`}
          >
            {/* Using the AutomataBanner component */}
            <AutomataBanner isDark={isDark} customThemeColor={themeColor} />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features"
        className={`py-20 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`${
                isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
              } font-bold mb-4`}
            >
              Powerful <span style={{ color: themeColor }}>Features</span> for
              Automata Enthusiasts
            </h2>
            <p
              className={`${isMobile ? "text-base" : "text-lg"} ${
                isDark ? "text-gray-300" : "text-gray-600"
              } max-w-3xl mx-auto`}
            >
              Explore a comprehensive suite of tools designed to make learning
              automata theory engaging and interactive.
            </p>
          </div>

          <div
            className={`grid ${
              isMobile
                ? "grid-cols-1 gap-6"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            }`}
          >
            {/* Feature 1 */}
            <div
              className={`p-6 rounded-xl transition-all duration-300 card-hover ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-50"
              } shadow-lg`}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: themeColor }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3
                className={`${
                  isMobile ? "text-lg" : "text-xl"
                } font-semibold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Interactive Simulators
              </h3>
              <p
                className={`${isMobile ? "text-sm" : "text-base"} ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Visualize and interact with DFA, NFA, PDA, and Turing Machines
                in real-time with our intuitive simulators.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className={`p-6 rounded-xl transition-all duration-300 card-hover ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-50"
              } shadow-lg`}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: themeColor }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3
                className={`${
                  isMobile ? "text-lg" : "text-xl"
                } font-semibold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Comprehensive Learning
              </h3>
              <p
                className={`${isMobile ? "text-sm" : "text-base"} ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Access detailed tutorials, examples, and problem sets to master
                automata theory concepts.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className={`p-6 rounded-xl transition-all duration-300 card-hover ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-50"
              } shadow-lg`}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: themeColor }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3
                className={`${
                  isMobile ? "text-lg" : "text-xl"
                } font-semibold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Mobile Optimized
              </h3>
              <p
                className={`${isMobile ? "text-sm" : "text-base"} ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Fully responsive design with touch-friendly controls, perfect
                for learning on any device.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-16 ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2
            className={`${
              isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
            } font-bold mb-4`}
          >
            Ready to Start Learning?
          </h2>
          <p
            className={`${isMobile ? "text-base" : "text-lg"} mb-8 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Join thousands of students and professionals exploring automata
            theory with our interactive platform.
          </p>
          <Link
            href="/simulator"
            className={`inline-block px-8 py-3 text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors touch-target ${
              isMobile ? "w-full sm:w-auto" : ""
            }`}
            style={{ backgroundColor: themeColor }}
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div>
        <footer
          className={`relative transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
              : '"bg-[#9adbcd] text-black"'
          }`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-20" />

          <div className="relative z-10">
            <div className="container mx-auto px-4 py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left">
                {/* Company Info */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <span className="text-xl font-medium">
                        <span style={{ color: "#70DAC2" }}>Automata</span>
                        <span
                          className={`font-bold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Verse
                        </span>
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">
                    Automata-Verse is an interactive educational platform for
                    learning and experimenting with theory of computation
                    concepts. The application provides intuitive visual
                    simulators for various automata models that are fundamental
                    to computer science.
                  </p>
                  {/* Social Media Links */}
                  <div className="flex space-x-4">
                    {/* Icons like Twitter, Pinterest, YouTube, Contributors */}
                  </div>
                </div>

                {/* simulator Links */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 text-center">
                    Simulators
                  </h4>
                  <nav className="flex flex-col space-y-3 items-left">
                    {[
                      { name: "DFA", path: "/simulator/dfa" },
                      { name: "NFA", path: "/simulator/nfa" },
                      { name: "PDA", path: "/simulator/pda" },
                      { name: "Turing machine", path: "/simulator/tm" },
                    ].map((link) => (
                      <Link
                        key={link.name}
                        href={link.path}
                        className="hover:text-teal-300 transition-all duration-300 text-sm flex items-center group"
                      >
                        <span className="w-4 flex justify-center">
                          <span className="w-2 h-2 bg-teal-700 rounded-full group-hover:scale-150 transition-transform"></span>
                        </span>
                        <span className="ml-3">{link.name}</span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Resources Links */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 text-center">
                    Resources
                  </h4>
                  <nav className="flex flex-col space-y-3 items-left">
                    {[
                      { name: "Getting started", path: "/getting-started" },
                      { name: "Features", path: "/features" },
                      { name: "Blog", path: "/blog" },
                      { name: "About", path: "/about" },
                    ].map((link) => (
                      <Link
                        key={link.name}
                        href={link.path}
                        className="hover:text-teal-300 transition-all duration-300 text-sm flex items-center group"
                      >
                        <span className="w-4 flex justify-center">
                          <span className="w-2 h-2 bg-teal-700 rounded-full group-hover:scale-150 transition-transform"></span>
                        </span>
                        <span className="ml-3">{link.name}</span>
                      </Link>
                    ))}
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSdmNyVJTWUU7G5W7Zxu6jX9NPHWoz4g82x67UEvc-y-0SaXkw/viewform?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-300 transition-all duration-300 text-sm flex items-center group"
                    >
                      <span className="w-4 flex justify-center">
                        <span className="w-2 h-2 bg-teal-700 rounded-full group-hover:scale-150 transition-transform"></span>
                      </span>
                      <span className="ml-3">feedback</span>
                    </a>
                  </nav>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 text-center">
                    Contact Info
                  </h4>
                  <div className="space-y-4 flex flex-col justify-center items-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <a
                          href="https://www.google.com/maps?q=123+Travel+Street,+Adventure+City,+AC+12345"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline block"
                        >
                          123 College Street
                          <br />
                          Kolkata, AC 12345
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm">+1 (555) 123-4567</p>
                        <p className="text-sm">Mon-Fri 9AM-6PM</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm">hello@automataverse.com</p>
                        <p className="text-sm">support@automataverse.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex align-middle justify-center">
                <div>
                  {" "}
                  <a
                    href="https://www.producthunt.com/posts/automataverse?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-automataverse"
                    target="_blank"
                  >
                    <img
                      src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=938252&theme=light&t=1741194877338"
                      alt="AutomataVerse - Automata&#0032;simulator&#0032;for&#0032;dfa&#0044;&#0032;nfa&#0044;&#0032;pda&#0032;&#0038;&#0032;turing&#0032;machines | Product Hunt"
                      style={{ width: "250px", height: "54px" }}
                      width="250"
                      height="54"
                    />
                  </a>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="border-t border-gray-700 mt-12 pt-8">
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
                  <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                    <p className="text-sm">
                      © 2025 AutomateVerse. All rights reserved.
                    </p>
                    <div className="flex space-x-4 text-sm">
                      <Link
                        href="/privacy"
                        className="hover:text-pink-300 transition-colors"
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        href="/terms"
                        className="hover:text-pink-300 transition-colors"
                      >
                        Terms of Service
                      </Link>
                      <Link
                        href="/contact"
                        className="hover:text-pink-300 transition-colors"
                      >
                        Contact
                      </Link>
                      <Link
                        href="/feedback"
                        className="hover:text-pink-300 transition-colors"
                      >
                        Feedback
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2  text-sm mt-4">
                  <span>Made with</span>
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>by AutomateVerse Team</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
