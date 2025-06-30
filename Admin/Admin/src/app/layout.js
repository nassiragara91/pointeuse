'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from 'react';
import Sidebar from './components/Sidebare';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ThemeProvider } from '@/contexts/theme-context';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <html lang="en" className={inter.className}>
      <head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Modern admin dashboard built with Next.js" />
      </head>
      <body className="min-h-screen bg-white dark:bg-slate-900">
        <ThemeProvider storageKey="admin-theme" defaultTheme="system">
          <div className="flex h-screen">
            <Sidebar collapsed={collapsed} />
            <div className="flex-1 flex flex-col">
              <Header collapsed={collapsed} setCollapsed={setCollapsed} />
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
              <div className="px-6">
                <Footer />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
