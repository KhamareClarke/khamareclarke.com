import React from "react";
import NavLink from "./NavLink";
import Link from "next/link";
import BookingButton from './BookingButton';

const MenuOverlay = ({ links }) => {
  return (
    <div className="flex flex-col py-4 items-center">
      <ul className="flex flex-col items-center space-y-2">
        {links.map((link, index) => (
          <li key={index} className="relative">
            <NavLink href={link.path} title={link.title} />
            {link.badge && (
              <span className="absolute -top-0.5 -right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-[6px] font-bold px-0.5 py-0.5 rounded-full animate-pulse scale-75">
              </span>
            )}
          </li>
        ))}
      </ul>
      <BookingButton
        className="mt-6 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#ffb700] text-[#222] font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center shadow-lg border-2 border-[#ffb700]"
        trackingLabel="menu_book_call"
      >
        <span className="mr-2">📞</span>
        Book a Call
      </BookingButton>
    </div>
  );
};

export default MenuOverlay;
