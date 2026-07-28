import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'COEPI - Job Tracker',
  description: 'AI-Powered Application Management',
};

export default function RootLayout({
  children,
}: {
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