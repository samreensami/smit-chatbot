/**
 * Voice Parser - Extracts announcement data from voice input
 * Supports English and Roman Urdu
 */

interface ParsedVoiceData {
  title?: string;
  category?: "class" | "workshop" | "holiday" | "general";
  details?: string;
  date?: string;
}

// Category keywords mapping
const categoryKeywords: Record<string, "class" | "workshop" | "holiday" | "general"> = {
  // English
  "class": "class",
  "lecture": "class",
  "lesson": "class",
  "session": "class",
  "workshop": "workshop",
  "training": "workshop",
  "bootcamp": "workshop",
  "holiday": "holiday",
  "vacation": "holiday",
  "off": "holiday",
  "leave": "holiday",
  "chutti": "holiday",
  "announcement": "general",
  "notice": "general",
  "update": "general",
  // Roman Urdu
  "sabaq": "class",
  "dars": "class",
  "sikhlai": "workshop",
};

// Date keywords
const dateKeywords: Record<string, () => string> = {
  "today": () => new Date().toISOString().split("T")[0],
  "aaj": () => new Date().toISOString().split("T")[0],
  "tomorrow": () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  },
  "kal": () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  },
  "next week": () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  },
  "monday": () => getNextDayOfWeek(1),
  "tuesday": () => getNextDayOfWeek(2),
  "wednesday": () => getNextDayOfWeek(3),
  "thursday": () => getNextDayOfWeek(4),
  "friday": () => getNextDayOfWeek(5),
  "saturday": () => getNextDayOfWeek(6),
  "sunday": () => getNextDayOfWeek(0),
};

function getNextDayOfWeek(dayOfWeek: number): string {
  const today = new Date();
  const currentDay = today.getDay();
  const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7 || 7;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilTarget);
  return targetDate.toISOString().split("T")[0];
}

/**
 * Parse voice transcript to extract announcement data
 */
export function parseVoiceInput(transcript: string): ParsedVoiceData {
  const result: ParsedVoiceData = {};
  const lowerTranscript = transcript.toLowerCase();
  const words = lowerTranscript.split(/\s+/);

  // Detect category
  for (const [keyword, category] of Object.entries(categoryKeywords)) {
    if (lowerTranscript.includes(keyword)) {
      result.category = category;
      break;
    }
  }

  // Detect date
  for (const [keyword, getDate] of Object.entries(dateKeywords)) {
    if (lowerTranscript.includes(keyword)) {
      result.date = getDate();
      break;
    }
  }

  // Extract title - first meaningful phrase (up to 8 words)
  // Remove common filler words
  const fillerWords = ["please", "create", "make", "new", "a", "an", "the", "for", "about", "regarding"];
  const cleanedWords = words.filter(w => !fillerWords.includes(w));

  if (cleanedWords.length > 0) {
    // Take first 5-8 words as potential title
    const titleWords = cleanedWords.slice(0, Math.min(8, cleanedWords.length));
    result.title = capitalizeWords(titleWords.join(" "));
  }

  // Full transcript becomes details
  result.details = transcript;

  return result;
}

/**
 * Capitalize first letter of each word
 */
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Smart merge - combines parsed data with existing form data
 */
export function mergeVoiceData(
  existing: ParsedVoiceData,
  parsed: ParsedVoiceData
): ParsedVoiceData {
  return {
    title: parsed.title || existing.title,
    category: parsed.category || existing.category,
    details: parsed.details
      ? (existing.details ? `${existing.details}\n${parsed.details}` : parsed.details)
      : existing.details,
    date: parsed.date || existing.date,
  };
}
