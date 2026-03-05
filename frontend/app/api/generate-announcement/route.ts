/**
 * SMIT AI Assistant - Generate Announcement API
 * ==============================================
 *
 * This endpoint uses Gemini AI to generate professional
 * SMIT-branded announcements with emojis.
 *
 * INPUT: eventName, dateTime, topic
 * OUTPUT: Professional announcement text
 *
 * @author SMIT Development Team
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { eventName, dateTime, topic } = await request.json();

    // Validate input
    if (!eventName || !topic) {
      return NextResponse.json(
        { success: false, error: "Event name and topic are required" },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      // Return a fallback template if no API key
      const fallbackAnnouncement = generateFallbackAnnouncement(eventName, dateTime, topic);
      return NextResponse.json({
        success: true,
        announcement: fallbackAnnouncement,
        source: "template",
      });
    }

    // Generate with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a professional, engaging announcement for SMIT (Saylani Mass IT Training) with the following details:

Event Name: ${eventName}
Date/Time: ${dateTime || "To be announced"}
Topic/Details: ${topic}

Requirements:
1. Use relevant emojis throughout the announcement
2. Keep it professional but friendly
3. Include SMIT branding
4. Make it suitable for WhatsApp sharing
5. Include a call-to-action
6. Keep it concise (under 200 words)
7. Add relevant hashtags at the end

Format it as a WhatsApp-ready announcement message.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const announcement = response.text();

    return NextResponse.json({
      success: true,
      announcement,
      source: "gemini",
    });
  } catch (error) {
    console.error("Error generating announcement:", error);

    // Return fallback on error
    const { eventName, dateTime, topic } = await request.json().catch(() => ({}));
    if (eventName) {
      const fallback = generateFallbackAnnouncement(eventName, dateTime, topic);
      return NextResponse.json({
        success: true,
        announcement: fallback,
        source: "fallback",
      });
    }

    return NextResponse.json(
      { success: false, error: "Failed to generate announcement" },
      { status: 500 }
    );
  }
}

/**
 * Generate a fallback announcement when AI is unavailable
 */
function generateFallbackAnnouncement(
  eventName: string,
  dateTime?: string,
  topic?: string
): string {
  return `📢 *SMIT ANNOUNCEMENT* 📢

━━━━━━━━━━━━━━━━━━━━

🎯 *${eventName.toUpperCase()}*

${dateTime ? `📅 *Date & Time:* ${dateTime}` : "📅 *Date:* To be announced"}

${topic ? `📝 *Details:*\n${topic}` : ""}

━━━━━━━━━━━━━━━━━━━━

✅ Don't miss this opportunity!
📍 Visit your nearest SMIT campus

🏛️ *Saylani Mass IT Training*
🌐 saylaniwelfare.com/smit
📞 Helpline: 0800-786-786

━━━━━━━━━━━━━━━━━━━━

#SMIT #SaylaniWelfare #ITTraining #FreeEducation #TechSkills`;
}
