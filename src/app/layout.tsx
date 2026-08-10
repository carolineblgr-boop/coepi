import './globals.css';
import type { Metadata } from 'next';

// In React, there's no html file like in Vue.
// Instead, we define the root layout in a component called RootLayout.
// This component wraps around all other components and provides a consistent structure for the application.
// In this case, it sets the language to English and applies global styles to the body element.
export const metadata: Metadata = {
  title: 'COEPI - Job Tracker',
  description: 'AI-Powered Application Management',
  openGraph: {
    title: 'COEPI',
    description: 'Job tracking dashboard',
  },
};

export default function RootLayout({
  children, // React's way of passing child components to a parent component. In Vue, we use <slot></slot> to achieve the same effect.
}: {
  // React.ReactNode is a type that represents any valid React child, including elements, strings,
  // numbers, fragments, portals, and arrays of these types.
  // In Vue, we don't have an exact equivalent, but we can think of it as the content that can be rendered inside a component.
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0d10] text-slate-300 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}