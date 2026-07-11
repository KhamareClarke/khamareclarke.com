'use client';

import React from "react";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const trackEvent = (category, action, label) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};

const ProjectCard = ({ imgUrl, title, description, gitUrl, previewUrl }) => {
  // Extract company name from title for display on top
  const getCompanyName = (title) => {
    if (title.includes("MyApproved.com")) return "MyApproved.com";
    if (title.includes("Omni WTMS")) return "Omni WTMS";
    if (title.includes("IdentI Marketing")) return "IdentI Marketing";
    return "";
  };

  const companyName = getCompanyName(title);

  return (
    <div className="bg-gradient-to-br from-[#181818] via-[#0A0A0A] to-black rounded-2xl shadow-2xl border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 transition-all duration-300 overflow-hidden hover:shadow-[#ffb700]/20 hover:shadow-lg">
      {/* Company Name - Top */}
      {companyName && (
        <div className="px-4 py-2 bg-[#ffb700]/10 border-b border-[#ffb700]/20">
          <p className="text-[#ffb700] text-sm font-medium">{companyName}</p>
        </div>
      )}
      
      {/* Image Section - Top */}
      <div
        className="h-48 relative group"
        style={{ background: `url(${imgUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="overlay items-center justify-center absolute top-0 left-0 w-full h-full bg-[#0a0a0a] bg-opacity-0 hidden group-hover:flex group-hover:bg-opacity-90 transition-all duration-300 backdrop-blur-sm">
          <Link
            href={gitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 w-12 mr-3 relative rounded-full group/link"
            onClick={(e) => {
              e.preventDefault();
              trackEvent('engagement', 'click_project_github', title);
              window.open(gitUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
            <CodeBracketIcon className="h-8 w-8 text-[#ffb700] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover/link:text-white z-10" />
          </Link>
          <Link
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 w-12 relative rounded-full group/link"
            onClick={(e) => {
              e.preventDefault();
              trackEvent('engagement', 'click_project_preview', title);
              window.open(previewUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
            <EyeIcon className="h-8 w-8 text-[#ffb700] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover/link:text-white z-10" />
          </Link>
        </div>
      </div>
      
      {/* Content Section - Bottom */}
      <div className="p-6">
        <h5 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-2 text-[#ffb700] group-hover:text-[#ff8c00] transition-colors duration-300">{title}</h5>
        <p className="text-[#ADB7BE] text-base line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
