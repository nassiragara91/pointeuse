import "@/styles/globals.css";
import NavBar from '../components/NavBar';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  BellIcon,
  EnvelopeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

function AppContent({ Component, pageProps }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't show NavBar on login page
  const showNavBar = user && router.pathname !== '/login';
  
  // Debug logging
  console.log('App state:', { user, loading, pathname: router.pathname, showNavBar });

  return (
    <>
      {showNavBar && <NavBar />}
      <Component {...pageProps} />
    </>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}
