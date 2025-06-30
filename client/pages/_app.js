import "@/styles/globals.css";
import NavBar from '../components/NavBar';
import {
  BellIcon,
  EnvelopeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

export default function App({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
}
