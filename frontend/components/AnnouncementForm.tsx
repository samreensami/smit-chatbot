"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import VoiceRecorder from "./VoiceRecorder";

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

export interface AnnouncementFormRef {
  updateField: (field: keyof AnnouncementData, value: string) => void;
  updateMultipleFields: (data: Partial<AnnouncementData>) => void;
  getFormData: () => AnnouncementData;
}

const inputStyle: React.CSSProperties = {
  color: "#1a202c",
  backgroundColor: "#ffffff",
};

const AnnouncementForm = forwardRef<AnnouncementFormRef, AnnouncementFormProps>(
  ({ onGenerate, initialData }, ref) => {
    const [formData, setFormData] = useState<AnnouncementData>({
      eventName: initialData?.eventName || "",
      dateTime: initialData?.dateTime || "",
      topic: initialData?.topic || "",
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      updateField: (field: keyof AnnouncementData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      },
      updateMultipleFields: (data: Partial<AnnouncementData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
      },
      getFormData: () => formData,
    }));

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError(null);
    };

    const handleVoiceForField = (field: keyof AnnouncementData) => (transcript: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field] ? `${prev[field]} ${transcript}` : transcript,
      }));
    };

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
          body: JSON.stringify(formData),
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
      } finally {
        setIsGenerating(false);
      }
    };

    const inputClasses = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/20 outline-none transition";

    return (
      <div className="space-y-5">
        {/* Event Name */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-gray-700">Event Name *</label>
            <VoiceRecorder onTranscript={handleVoiceForField("eventName")} targetField="eventName" />
          </div>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="e.g., Python Admission Open"
            className={inputClasses}
            style={inputStyle}
          />
        </div>

        {/* Date & Time with Calendar */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Date & Time *</label>
          <input
            type="datetime-local" // Yeh calendar aur AM/PM picker layega
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className={inputClasses}
            style={inputStyle}
          />
          <p className="text-[10px] text-gray-400 mt-1">Select date and time (AM/PM supported)</p>
        </div>

        {/* Topic / Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-gray-700">Main Topic / Details *</label>
            <VoiceRecorder onTranscript={handleVoiceForField("topic")} targetField="topic" />
          </div>
          <textarea
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Write key points (e.g., 8 March deadline, fee 500, etc.)"
            rows={4}
            className={`${inputClasses} resize-none`}
            style={inputStyle}
          />
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleGenerateWithAI}
            disabled={isGenerating}
            className="flex-1 bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white py-4 rounded-xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? "⚙️ Generating..." : "🤖 Generate with AI"}
          </button>
        </div>
      </div>
    );
  }
);

AnnouncementForm.displayName = "AnnouncementForm";
export default AnnouncementForm;