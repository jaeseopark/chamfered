import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Email obfuscation via event delegation
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a[data-email-obfuscate]');
      if (!link || !(link instanceof HTMLAnchorElement)) return;
      event.preventDefault();
      const parts = [106, 97, 101, 115, 101, 111].map((c) => String.fromCharCode(c)).join('');
      const domain = [99, 104, 97, 109, 102, 101, 114, 101, 100, 46, 100, 101, 118]
        .map((c) => String.fromCharCode(c))
        .join('');
      const subject = encodeURIComponent('Chamfered Order Inquiry');
      const email = link.dataset.email ?? `${parts}@${domain}`;
      window.location.href = `mailto:${email}?subject=${subject}`;
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
