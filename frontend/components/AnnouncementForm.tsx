/**
 * SMIT AI Assistant - Simplified Announcement Form
 * =================================================
 *
 * Simplified form with only 3 fields:
 * - Event Name
 * - Date/Time
 * - Main Topic
 *
 * Features "Generate with AI" button that creates a professional
 * SMIT-branded announcement using Gemini API.
 *
 * @author SMIT Development Team
 */

"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import VoiceRecorder from "./VoiceRecorder";

// Type definition for announcement data
interface AnnouncementData {
  eventName: string;
  dateTime: string;
  topic: string;
  generatedContent?: string;
}

interface AnnouncementFormProps {
  onGenerate: (data: AnnouncementData) => void;
  initialData?: Partial<AnnouncementData>;
}

// Ref interface for parent component access
export interface AnnouncementFormRef {
  updateField: (field: keyof AnnouncementData, value: string) => void;
  updateMultipleFields: (data: Partial<AnnouncementData>) => void;
  getFormData: () => AnnouncementData;
}

/**
 * Inline styles to ensure input text visibility
 */
const inputStyle: React.CSSProperties = {
  color: "#1a202c",
  WebkitTextFillColor: "#1a202c",
  backgroundColor: "#ffffff",
};

const AnnouncementForm = forwardRef<AnnouncementFormRef, AnnouncementFormProps>(
  ({ onGenerate, initialData }, ref) => {
    // Form state with simplified fields
    const [formData, setFormData] = useState<AnnouncementData>({
      eventName: initialData?.eventName || "",
      dateTime: initialData?.dateTime || "",
      topic: initialData?.topic || "",
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      updateField: (field: keyof AnnouncementData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      },
      updateMultipleFields: (data: Partial<AnnouncementData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
      },
      getFormData: () => formData,
    }));

    /**
     * Handle input field changes
     */
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError(null);
    };

    /**
     * Handle voice input for specific fields
     */
    const handleVoiceForField = (field: keyof AnnouncementData) => (transcript: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field] ? `${prev[field]} ${transcript}` : transcript,
      }));
    };

    /**
     * Generate announcement with AI (Gemini)
     */
    const handleGenerateWithAI = async () => {
      if (!formData.eventName.trim() || !formData.topic.trim()) {
        setError("Please fill in Event Name and Topic");
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        const response = await fetch("/api/generate-announcement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: formData.eventName,
            dateTime: formData.dateTime,
            topic: formData.topic,
          }),
        });

        const data = await response.json();

        if (data.success && data.announcement) {
          onGenerate({
            ...formData,
            generatedContent: data.announcement,
          });
        } else {
          setError(data.error || "Failed to generate announcement");
        }
      } catch (err) {
        setError("Failed to connect to AI service");
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    };

    /**
     * Quick generate without AI (simple template)
     */
    const handleQuickGenerate = () => {
      if (!formData.eventName.trim()) {
        setError("Please enter an Event Name");
        return;
      }

      const quickContent = `📢 SMIT ANNOUNCEMENT 📢

🎯 ${formData.eventName.toUpperCase()}

📅 Date: ${formData.dateTime || "To be announced"}

📝 ${formData.topic || "More details coming soon!"}

🏛️ Saylani Mass IT Training
🌐 saylaniwelfare.com/smit

#SMIT #SaylaniWelfare #ITTraining`;

      onGenerate({
        ...formData,
        generatedContent: quickContent,
      });
    };

    // Common input classes
    const inputClasses = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/20 outline-none transition";

    return (
      <div className="space-y-5">
        {/* Event Name Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Event Name *
            </label>
            <VoiceRecorder
              onTranscript={handleVoiceForField("eventName")}
              targetField="eventName"
            />
          </div>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="e.g., Web Development Workshop"
            className={inputClasses}
            style={inputStyle}
          />
        </div>

        {/* Date/Time Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date & Time
          </label>
          <input
            type="text"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            placeholder="e.g., Monday, March 15 at 10:00 AM"
            className={inputClasses}
            style={inputStyle}
          />
        </div>

        {/* Main Topic Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Main Topic / Details *
            </label>
            <VoiceRecorder
              onTranscript={handleVoiceForField("topic")}
              targetField="topic"
            />
          </div>
          <textarea
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Brief description of what this event is about..."
            rows={3}
            className={inputClasses + " resize-none"}
            style={inputStyle}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Tip Box */}
        <div className="bg-linear-to-r from-[#0066cc]/5 to-[#8cc63f]/5 border border-[#0066cc]/20 rounded-xl p-4 text-sm text-gray-600">
          <strong className="text-[#0066cc]">💡 Tip:</strong> Click "Generate with AI" for a professional announcement, or "Quick Generate" for a simple template.
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Generate with AI Button */}
          <button
            type="button"
            onClick={handleGenerateWithAI}
            disabled={isGenerating}
            className="flex-1 bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white py-4 rounded-xl font-semibold hover:from-[#0055b3] hover:to-[#7ab82e] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">⚙️</span>
                Generating...
              </>
            ) : (
              <>
                <span>🤖</span>
                Generate with AI
              </>
            )}
          </button>

          {/* Quick Generate Button */}
          <button
            type="button"
            onClick={handleQuickGenerate}
            className="px-6 py-4 border-2 border-[#0066cc] text-[#0066cc] rounded-xl font-semibold hover:bg-[#0066cc]/5 transition-all duration-200"
          >
            ⚡ Quick
          </button>
        </div>
      </div>
    );
  }
);

AnnouncementForm.displayName = "AnnouncementForm";

export default AnnouncementForm;
