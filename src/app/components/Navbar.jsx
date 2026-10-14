"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import CTAButton from "./CTAButton";
import GoldMark from "./GoldMark";
import NavbarWrapper from "./ui/NavbarWrapper";

const navLinks = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Services",
    path: "/services",
  },
  {
    title: "Business Bundle",
    path: "/business-bundle",
  },
  {
    title: "Case Studies",
    path: "/case-studies",
  },
];

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  React.useEffect(() => {
    const sectionIds = ['home', 'about', 'services', 'case-studies', 'faq', 'hire-me', 'contact', 'pricing', 'resources'];
    const sectionElements = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const handleScroll = () => {
      let found = 'home';
      for (let section of sectionElements) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom > 80) {
          found = section.id;
          break;
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed w-full top-0 left-0 right-0 z-20 bg-surface shadow-ds-md">
      <NavbarWrapper className="flex flex-wrap items-center justify-between lg:py-4 py-2">
        <div className="flex items-center">
          <Link href="/" aria-label="Khamare Clarke, home">
            {/* Runs the preloader's own canvas wave rather than a CSS gradient sweep,
                so the mark on the page and the mark on the loading screen are the same
                code. See GoldMark. The accessible name sits on the link, because the
                mark itself is decorative. */}
            <GoldMark className="h-14 w-14 md:h-20 md:w-20" />
          </Link>
        </div>
        {/* The bar carries `flex-wrap` defensively, but the four uppercase links plus
            the logo plus the CTA need 853px of content against only 720px of available
            width at 768px, so from 768 to about 900px the CTA was wrapping onto a second
            row and dangling under the logo, which also made the fixed bar 136px tall and
            swallowed the top of every page. The links therefore now appear at `lg`, and
            the hamburger covers everything below it. Above 1024px the content fits on one
            row with 120px to spare, so nothing wraps at any width. */}
        <div className="mobile-menu block lg:hidden">
          {!navbarOpen ? (
            <button
              onClick={() => setNavbarOpen(true)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setNavbarOpen(false)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="menu hidden lg:block lg:w-auto" id="navbar">
          <ul className="flex items-center space-x-6 text-sm lg:text-base font-semibold uppercase tracking-wide">
            {navLinks.map((link, index) => (
              <li key={index} className="relative">
                <NavLink href={link.path} title={link.title} active={activeSection === link.path.replace('#','')} />
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:flex items-center">
          <CTAButton
            className="whitespace-nowrap"
            compact
            icon="phone"
            eventLabel="nav_book_consultation"
            caption="Free 30-minute introductory call. No obligation."
            captionClassName="hidden lg:block"
          >
            Book a Consultation
          </CTAButton>
        </div>
      </NavbarWrapper>
      {navbarOpen ? <MenuOverlay links={navLinks} /> : null}
    </nav>
  );
};

export default Navbar;
