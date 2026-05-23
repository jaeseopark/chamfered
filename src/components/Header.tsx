import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { SITE_TAGLINE } from '../consts';

export default function Header() {
  const menuRef = useRef<HTMLDialogElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => menuRef.current?.close();

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b border-white/10 bg-[rgb(15_23_42_/_0.92)] text-white backdrop-blur transition-shadow duration-300${scrolled ? ' shadow-lg' : ''}`}
      >
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-3 text-xl font-bold">
              <img src="/images/logo.svg" alt="Chamfered logo" width="32" height="32" />
              <div className="leading-none">
                <span className="block">Chamfered</span>
                <span className="block text-[0.75rem] font-medium uppercase tracking-[0.28em] text-[hsl(176,35%,63%)]">
                  {SITE_TAGLINE}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              aria-label="Open main menu"
              onClick={openMenu}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white/80 hover:bg-white/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="size-6"
              >
                <path
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-8">
            <Link
              to="/products"
              className="text-sm/6 font-semibold text-white/80 transition hover:text-white"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-sm/6 font-semibold text-white/80 transition hover:text-white"
            >
              About
            </Link>
          </div>
        </nav>
      </header>

      <dialog
        ref={menuRef}
        className="fixed inset-y-0 right-0 z-50 m-0 h-full w-full overflow-y-auto bg-[rgb(15,23,42)] p-6 text-white sm:max-w-sm sm:ring-1 sm:ring-white/10 backdrop:bg-black/40"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="-m-1.5 p-1.5 flex items-center gap-3 text-xl font-bold"
          >
            <img src="/images/logo.svg" alt="Chamfered logo" width="32" height="32" />
            <div className="leading-none">
              <span className="block">Chamfered</span>
              <span className="block text-[0.75rem] font-medium uppercase tracking-[0.28em] text-[hsl(176,35%,63%)]">
                {SITE_TAGLINE}
              </span>
            </div>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="-m-2.5 rounded-md p-2.5 text-white/80 hover:bg-white/10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
              className="size-6"
            >
              <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-white/10">
            <div className="space-y-2 py-6">
              <Link
                to="/products"
                onClick={closeMenu}
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/10"
              >
                Products
              </Link>
              <Link
                to="/about"
                onClick={closeMenu}
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/10"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
