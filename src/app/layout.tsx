import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';
import AuthStateListener from './context/AuthStateListener';
import { ReduxProvider } from './context/ReduxProvider';
import { ResponsiveProvider } from './context/ResponsiveContext';
import { ThemeProvider } from './context/ThemeContext';
import './globals.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <title>AutomataVerse - Automata Simulator for DFA, NFA, PDA & Turing Machines</title>
        {/* seo */}
        <meta name="description" content="Learn about automata theory and formal languages with our interactive simulator. Explore finite automata, pushdown automata, and more with our intuitive tools." />
        <meta name="keywords" content="automata theory, formal languages, finite automata, pushdown automata, interactive simulator" />
        <meta
          name="description"
          content="Automataverse is an online automata simulator where you can visualize and test DFA, NFA, PDA, and Turing Machines interactively."
        />
        <meta
          name="keywords"
          content="automata simulator, DFA simulator, NFA, PDA, Turing Machine, finite automata, computational theory, formal languages"
        />
        <meta name="author" content="AutomataVerse" />

        {/* Enhanced mobile viewport and touch handling */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AutomataVerse" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />

        <meta name="robots" content="index, follow" />


        {/* Google Analytics Script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-MNYTFDC90Z"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MNYTFDC90Z');
          `}
        </Script>
      </head>
      <body className="transition-colors duration-200">
        <ReduxProvider>
          <AuthStateListener>
            <ThemeProvider>
              <ResponsiveProvider>
                {children} <Analytics />
              </ResponsiveProvider>
            </ThemeProvider>
          </AuthStateListener>
        </ReduxProvider>
      </body>
    </html>
  );
}
