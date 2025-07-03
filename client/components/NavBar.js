import { useState, useRef, useEffect } from 'react';
// import Image from 'next/image'; // Plus nécessaire
import {
  DocumentTextIcon,
  ChartBarIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  EnvelopeIcon,
  HomeIcon,
  ChevronDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const navLinks = [
  { name: 'Pointage', icon: ClockIcon, href: '/addPointage' },
  { name: 'GED', icon: DocumentTextIcon, href: '/ged' },
  { name: 'Rapports', icon: ChartBarIcon, href: '/rapports' },
  { name: 'Applications', icon: Squares2X2Icon, href: '#' },
  { name: 'Recherche', icon: MagnifyingGlassIcon, href: '#' },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();
  // À remplacer par ta vraie logique d'authentification
  const isAdmin = true; // ou false pour tester

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <nav className="bg-blue-600 w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img className="h-10 w-auto" src="/logo.png" alt="HVEK Logo" />
        </div>
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-sm font-medium text-white">
          <a href="/" className="flex items-center gap-1 hover:text-blue-200 transition">
            <HomeIcon className="h-5 w-5" /> Accueil
          </a>
          {navLinks.map(({ name, icon: Icon, href }) => (
            <a key={name} href={href} className="flex items-center gap-1 hover:text-blue-200 transition">
              <Icon className="h-5 w-5" /> {name}
            </a>
          ))}
          {isAdmin && (
            <a href="http://localhost:3001/dashbord" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-200 transition">
              <HomeIcon className="h-5 w-5" /> Dashboard
            </a>
          )}
        </div>
        {/* User/Menu */}
        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-blue-200">
            <EnvelopeIcon className="h-6 w-6" />
          </button>
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center space-x-1 focus:outline-none"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <UserCircleIcon className="h-8 w-8 text-white" />
              <ChevronDownIcon className="h-4 w-4 text-white" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-1 z-30 animate-fade-in">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 text-sm"
                >
                  Mon profil
                </a>
                <button
                  onClick={() => { window.location.href = '/login'; }}
                  className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 text-sm"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-full hover:bg-blue-500" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 px-4 pb-4">
          <div className="flex flex-col space-y-2 mt-2">
            <a href="/" className="flex items-center gap-2 text-white py-2 px-2 rounded hover:bg-blue-500 transition">
              <HomeIcon className="h-5 w-5" /> Accueil
            </a>
            {navLinks.map(({ name, icon: Icon, href }) => (
              <a key={name} href={href} className="flex items-center gap-2 text-white py-2 px-2 rounded hover:bg-blue-500 transition">
                <Icon className="h-5 w-5" /> {name}
              </a>
            ))}
            {isAdmin && (
              <a href="http://localhost:3001/dashbord" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white py-2 px-2 rounded hover:bg-blue-500 transition">
                <HomeIcon className="h-5 w-5" /> Dashboard
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 