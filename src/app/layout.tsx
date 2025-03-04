import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import Script from 'next/script';

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
