/**
 * SMIT AI Assistant - Input Box Component
 * ========================================
 *
 * This component renders the chat input field and send button.
 * The send button uses the SMIT gradient (blue to green).
 *
 * STYLING NOTES:
 * - Input has dark text (#1a202c) on white background
 * - Placeholder is gray-500 for visibility
 * - Focus state uses SMIT Blue (#0066cc) border
 * - Send button has SMIT gradient
 *
 * @author SMIT Development Team
 */

"use client";

import { useState } from "react";

interface InputBoxProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function InputBox({ onSend, disabled }: InputBoxProps) {
  const [message, setMessage] = useState("");

  /**
   * Handle form submission
   * Sends message and clears input field
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
      <div className="flex gap-3">
        {/* ========================================
            INPUT FIELD
            - Dark text color for visibility
            - Gray placeholder
            - Blue focus border
            ======================================== */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/20 outline-none transition disabled:opacity-50 disabled:bg-gray-100"
          style={{
            color: "#1a202c",
            WebkitTextFillColor: "#1a202c",
            backgroundColor: "#ffffff",
          }}
        />

        {/* ========================================
            SEND BUTTON - SMIT Gradient Applied
            bg-gradient-to-r from-[#0066cc] to-[#8cc63f]
            ======================================== */}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-6 py-3 bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white rounded-full font-semibold hover:from-[#0055b3] hover:to-[#7ab82e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          Send
        </button>
      </div>
    </form>
  );
}
