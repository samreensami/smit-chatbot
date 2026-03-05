/**
 * SMIT AI Assistant - Announcement Card Component
 * ================================================
 *
 * Displays the generated announcement with SMIT branding.
 * Supports both AI-generated content and simple templates.
 *
 * @author SMIT Development Team
 */

"use client";

import { forwardRef } from "react";
import Image from "next/image";

interface AnnouncementCardProps {
  eventName: string;
  dateTime?: string;
  topic?: string;
  generatedContent?: string;
}

const AnnouncementCard = forwardRef<HTMLDivElement, AnnouncementCardProps>(
  ({ eventName, dateTime, topic, generatedContent }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white rounded-2xl shadow-xl border-4 border-[#8cc63f] overflow-hidden max-w-md mx-auto"
      >
        {/* Header with Gradient */}
        <div className="bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white py-5 px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image
              src="/smit-logo.svg"
              alt="SMIT Logo"
              width={55}
              height={55}
              className="rounded-full bg-white p-1"
            />
            <div className="text-left">
              <span className="text-2xl font-bold block">SMIT</span>
              <span className="text-xs opacity-90">Saylani Mass IT Training</span>
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="bg-[#0066cc]/10 py-3 px-4 text-center">
          <span className="text-[#0066cc] font-bold text-lg">
            📢 ANNOUNCEMENT
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {generatedContent ? (
            // Display AI-generated content
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
              {generatedContent}
            </div>
          ) : (
            // Display simple template
            <>
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                {eventName}
              </h2>

              {dateTime && (
                <div className="flex items-center justify-center gap-2 text-[#0066cc] font-medium">
                  <span>📅</span>
                  <span>{dateTime}</span>
                </div>
              )}

              {topic && (
                <p className="text-gray-600 text-center leading-relaxed">
                  {topic}
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer with Gradient */}
        <div className="bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white py-4 px-6 text-center">
          <p className="text-sm font-medium">
            SMIT - Building Future Tech Leaders
          </p>
          <p className="text-xs opacity-80 mt-1">saylaniwelfare.com</p>
        </div>
      </div>
    );
  }
);

AnnouncementCard.displayName = "AnnouncementCard";

export default AnnouncementCard;
