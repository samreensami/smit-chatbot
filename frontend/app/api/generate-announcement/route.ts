/**
 * SMIT AI Assistant - Multi-Agent Announcement Generator
 * =======================================================
 *
 * AGENT LOGIC:
 * - Finance Agent: fee, paid, dues, payment (Professional & Firm)
 * - Admissions Agent: admission, apply, course (Welcoming & Future-oriented)
 * - Event Agent: hackathon, workshop, event (High-energy & Motivational)
 * - Generic Agent: everything else (Friendly & Informative)
 *
 * FORMAT: WhatsApp-ready with bold/italics
 * START: "Assalam-o-Alaikum" + "Dear Students,"
 * END: "Best regards, SMIT MANAGEMENT"
 *
 * @author SMIT Development Team
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Agent Types
type AgentType = "finance" | "admissions" | "event" | "generic";

/**
 * Detect which agent should handle this announcement
 */
function detectAgent(topic: string, eventName: string): AgentType {
  const text = `${topic} ${eventName}`.toLowerCase();

  // Finance Agent Keywords
  if (/fee|paid|dues|payment|challan|deposit|refund|scholarship|amount|receipt/i.test(text)) {
    return "finance";
  }

  // Admissions Agent Keywords
  if (/admission|apply|course|enroll|registration|batch|intake|eligibility|join|new batch/i.test(text)) {
    return "admissions";
  }

  // Event Agent Keywords
  if (/hackathon|workshop|event|competition|seminar|bootcamp|ceremony|session|training|webinar|meetup/i.test(text)) {
    return "event";
  }

  return "generic";
}

/**
 * Get agent-specific configuration
 */
function getAgentConfig(agent: AgentType) {
  switch (agent) {
    case "finance":
      return {
        name: "FINANCE AGENT",
        tone: "Professional, firm, and clear",
        style: "Emphasize deadlines, consequences, and payment requirements",
        emoji: "💰💳📋⚠️",
        color: "#dc2626" // Red for urgency
      };

    case "admissions":
      return {
        name: "ADMISSIONS AGENT",
        tone: "Welcoming, encouraging, and future-oriented",
        style: "Highlight opportunities, career growth, free education benefits",
        emoji: "🎓📚✨🚀🌟",
        color: "#16a34a" // Green for growth
      };

    case "event":
      return {
        name: "EVENT AGENT",
        tone: "High-energy, motivational, and exciting",
        style: "Create FOMO, highlight prizes, networking, learning opportunities",
        emoji: "🔥🏆💻🎯🎉⚡",
        color: "#7c3aed" // Purple for excitement
      };

    default:
      return {
        name: "GENERIC AGENT",
        tone: "Friendly, informative, and professional",
        style: "Clear and concise communication",
        emoji: "📢✅📍ℹ️",
        color: "#0066cc" // SMIT Blue
      };
  }
}

/**
 * Format datetime for display
 */
function formatDateTime(dateTime: string): string {
  if (!dateTime) return "To be announced";

  try {
    const date = new Date(dateTime);
    return date.toLocaleString("en-PK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  } catch {
    return dateTime;
  }
}

/**
 * Generate announcement using multi-agent templates
 */
function generateAgentAnnouncement(
  agent: AgentType,
  eventName: string,
  dateTime: string,
  topic: string
): string {
  const formattedDate = formatDateTime(dateTime);

  // Common header - WhatsApp formatted
  let announcement = `*_Assalam-o-Alaikum!_* ✨\n\n`;
  announcement += `*_Dear Students,_*\n\n`;

  switch (agent) {
    case "finance":
      announcement += `💰 *IMPORTANT FEE NOTICE* 💰\n`;
      announcement += `━━━━━━━━━━━━━━━━━━━━\n\n`;
      announcement += `📋 *${eventName.toUpperCase()}*\n\n`;
      announcement += `This is an important notice regarding ${topic || "fee payment matters"}.\n\n`;
      announcement += `📅 *Deadline:* ${formattedDate}\n\n`;
      announcement += `⚠️ *Please Note:*\n`;
      announcement += `• Timely payment is mandatory\n`;
      announcement += `• Keep your fee receipt safe for verification\n`;
      announcement += `• Late payments may result in restricted class access\n`;
      announcement += `• Contact admin office for payment plans if needed\n\n`;
      announcement += `💳 *Payment Methods:*\n`;
      announcement += `• Cash at campus office\n`;
      announcement += `• Bank transfer (details at admin)\n`;
      announcement += `• JazzCash/Easypaisa\n\n`;
      announcement += `_Your cooperation is highly appreciated._\n\n`;
      break;

    case "admissions":
      announcement += `🎓 *ADMISSIONS OPEN!* 🎓\n`;
      announcement += `━━━━━━━━━━━━━━━━━━━━\n\n`;
      announcement += `🚀 *${eventName.toUpperCase()}*\n\n`;
      announcement += `${topic || "We are excited to announce new admissions!"}\n\n`;
      announcement += `📅 *Starting:* ${formattedDate}\n\n`;
      announcement += `✨ *Why Choose SMIT?*\n`;
      announcement += `• 100% FREE IT Education\n`;
      announcement += `• Industry-Expert Instructors\n`;
      announcement += `• Hands-on Project Experience\n`;
      announcement += `• Job Placement Assistance\n`;
      announcement += `• Recognized Certification\n\n`;
      announcement += `📚 *Courses Available:*\n`;
      announcement += `Web Development | Mobile Apps | AI/ML | Graphic Design | Digital Marketing\n\n`;
      announcement += `🌟 _Transform your career with SMIT!_\n\n`;
      announcement += `📝 *Apply Now:* saylaniwelfare.com/smit\n\n`;
      break;

    case "event":
      announcement += `🔥 *GET READY!* 🔥\n`;
      announcement += `━━━━━━━━━━━━━━━━━━━━\n\n`;
      announcement += `🏆 *${eventName.toUpperCase()}*\n\n`;
      announcement += `${topic || "An exciting opportunity awaits!"}\n\n`;
      announcement += `📅 *When:* ${formattedDate}\n`;
      announcement += `📍 *Where:* SMIT Campus\n\n`;
      announcement += `🎯 *What's In Store:*\n`;
      announcement += `• Hands-on Learning Sessions\n`;
      announcement += `• Network with Industry Experts\n`;
      announcement += `• Win Exciting Prizes! 🎁\n`;
      announcement += `• Certificates for All Participants\n`;
      announcement += `• Free Refreshments\n\n`;
      announcement += `⚡ *Why Attend?*\n`;
      announcement += `_Level up your skills, build your portfolio, and connect with like-minded tech enthusiasts!_\n\n`;
      announcement += `🏃 *Limited Seats Available!*\n`;
      announcement += `Register now before it's too late!\n\n`;
      break;

    default:
      announcement += `📢 *ANNOUNCEMENT* 📢\n`;
      announcement += `━━━━━━━━━━━━━━━━━━━━\n\n`;
      announcement += `📌 *${eventName.toUpperCase()}*\n\n`;
      announcement += `${topic || "Important information for all students."}\n\n`;
      announcement += `📅 *Date:* ${formattedDate}\n`;
      announcement += `📍 *Venue:* SMIT Campus\n\n`;
      announcement += `ℹ️ For more information, contact your class coordinator or visit the admin office.\n\n`;
  }

  // Common footer
  announcement += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  announcement += `🏛️ *Saylani Mass IT Training*\n`;
  announcement += `🌐 saylaniwelfare.com/smit\n`;
  announcement += `📞 Helpline: 0800-786-786\n\n`;
  announcement += `*Best regards,*\n`;
  announcement += `*SMIT MANAGEMENT*\n\n`;
  announcement += `#SMIT #SaylaniWelfare #FreeITEducation`;

  return announcement;
}

export async function POST(request: NextRequest) {
  try {
    const { eventName, dateTime, topic } = await request.json();

    // Validate input
    if (!eventName) {
      return NextResponse.json(
        { success: false, error: "Event name is required" },
        { status: 400 }
      );
    }

    // Detect which agent should handle this
    const agent = detectAgent(topic || "", eventName);
    const agentConfig = getAgentConfig(agent);
    console.log(`[Multi-Agent] Using ${agentConfig.name}`);

    // Try Gemini API if available
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are the ${agentConfig.name} for SMIT (Saylani Mass IT Training).

YOUR PERSONALITY:
- Tone: ${agentConfig.tone}
- Style: ${agentConfig.style}
- Preferred Emojis: ${agentConfig.emoji}

ANNOUNCEMENT DETAILS:
- Event: ${eventName}
- Date/Time: ${formatDateTime(dateTime)}
- Topic: ${topic || "General announcement"}

STRICT FORMAT REQUIREMENTS:
1. START with: "*_Assalam-o-Alaikum!_*" and "*_Dear Students,_*"
2. Use WhatsApp formatting: *bold* for headings, _italics_ for emphasis
3. Include relevant emojis (${agentConfig.emoji})
4. Be ${agentConfig.tone.toLowerCase()}
5. END with: "*Best regards,*" and "*SMIT MANAGEMENT*"
6. Add hashtags: #SMIT #SaylaniWelfare #FreeITEducation
7. Keep it 150-200 words
8. Make it engaging and WhatsApp-shareable

Generate the announcement now:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const announcement = response.text();

        return NextResponse.json({
          success: true,
          announcement,
          agent,
          agentName: agentConfig.name,
          source: "gemini"
        });
      } catch (aiError) {
        console.error("Gemini API error, using template:", aiError);
      }
    }

    // Fallback: Generate using agent template
    const announcement = generateAgentAnnouncement(agent, eventName, dateTime, topic);

    return NextResponse.json({
      success: true,
      announcement,
      agent,
      agentName: agentConfig.name,
      source: "template"
    });

  } catch (error) {
    console.error("Error generating announcement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate announcement" },
      { status: 500 }
    );
  }
}
