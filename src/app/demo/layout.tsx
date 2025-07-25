import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DFA Interactive Demo | AutomataVerse',
  description: 'Learn how to design and test Deterministic Finite Automata with our interactive demo. Perfect for students and educators.',
  keywords: ['DFA', 'demo', 'interactive', 'automata', 'finite state machine', 'education'],
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
