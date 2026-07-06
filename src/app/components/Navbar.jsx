"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import CTAButton from "./CTAButton";
import NavbarWrapper from "./ui/NavbarWrapper";

const navLinks = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Services",
    path: "/services",
  },
  {
    title: "Business Bundle",
    path: "/business-bundle",
    badge: "Special Offer",
  },
  {
    title: "Case Studies",
    path: "/case-studies",
  },
  {
    title: "Blog",
    path: "/blog",
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
    <nav className="fixed w-full top-0 left-0 right-0 z-20 bg-[#111015] shadow-ds-md">
      <NavbarWrapper className="flex flex-wrap items-center justify-between lg:py-4 py-2">
        <div className="flex items-center">
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" className="h-14 w-auto md:h-20 transition-all duration-300" />
          </Link>
        </div>
        <div className="mobile-menu block md:hidden">
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
        <div className="menu hidden md:block md:w-auto" id="navbar">
          <ul className="flex items-center space-x-6 text-sm md:text-base font-semibold uppercase tracking-wide">
            {navLinks.map((link, index) => (
              <li key={index} className="relative">
                <NavLink href={link.path} title={link.title} active={activeSection === link.path.replace('#','')} />
                {link.badge && (
                  <span className="absolute -top-5 -right-3 bg-gradient-to-r from-[#ff3c00] via-[#ff8c00] to-[#ff3c00] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-md whitespace-nowrap">
                    {link.badge}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-red-500/50 to-transparent blur-sm"></div>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:flex items-center">
          <CTAButton 
            className="whitespace-nowrap text-sm px-4 py-2"
            icon="phone"
            eventLabel="nav_book_consultation"
            caption="Designed for teams ready to get clarity and move fast."
          >
            BOOK A FREE CALL
          </CTAButton>
        </div>
      </NavbarWrapper>
      {navbarOpen ? <MenuOverlay links={navLinks} /> : null}
    </nav>
  );
};

export default Navbar;
