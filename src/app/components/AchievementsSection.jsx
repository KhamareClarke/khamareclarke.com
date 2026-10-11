"use client";
import React from "react";
import CTAButton from "./CTAButton";

// Trust badges — rendered directly on the page background, with no tile or card
// wrapper around them. Both badges carry their own light artwork (white wordmarks),
// so neither needs a backing panel on the dark surface.
const badges = [
  {
    src: "/images/chamber-of-commerce.webp",
    alt: "Staffordshire Chambers of Commerce Member",
  },
  {
    src: "/images/networkin.webp",
    alt: "NetworkIN Member",
  },
];

const AchievementsSection = () => {
  return (
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Badges */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {badges.map((badge, index) => (
            <img
              key={index}
              src={badge.src}
              alt={badge.alt}
              loading="lazy"
              className="reveal-img h-24 md:h-28 w-auto max-w-full object-contain"
              style={{ "--rv-delay": `${index * 120}ms` }}
            />
          ))}
        </div>
      </div>

      <div className="reveal max-w-7xl mx-auto text-center" style={{ "--rv-delay": "300ms" }}>
        <CTAButton
          href="/#contact"
          eventLabel="achievements_book_consultation"
          caption="MSc Computer Science & AI, Keele University. Finishing 2027."
        >
          Book a Consultation
        </CTAButton>
      </div>
    </div>
  );
};

export default AchievementsSection;
