/**
 * SMIT AI Assistant - Chat Logic Module
 * ======================================
 *
 * This module handles the chatbot's response logic using a LOCAL-FIRST approach
 * to save Gemini API tokens. The flow is:
 *
 * 1. Check for greetings (hi, hello, etc.)
 * 2. Check for thanks/goodbye
 * 3. Search local FAQ database by keywords
 * 4. If no match found, return fallback (or call Gemini API)
 *
 * TOKEN SAVING STRATEGY:
 * - Quick Questions always use local data (no API call)
 * - Common FAQs are matched locally first
 * - Gemini API is only called for unknown queries
 *
 * @author SMIT Development Team
 * @version 1.0.0
 */

import smitFaq from "./smit_faq.json";

// Type definitions for FAQ data structure
interface FAQ {
  id: string;
  category: string;
  keywords: string[];
  question: string;
  answer: string;
}

interface QuickQuestion {
  id: string;
  text: string;
  faqId: string;
}

// Extract data from JSON
const faqs: FAQ[] = smitFaq.faqs;
const quickQuestions: QuickQuestion[] = smitFaq.quickQuestions;
const greetings = smitFaq.greetings;
const thanks = smitFaq.thanks;
const goodbye = smitFaq.goodbye;
const fallback = smitFaq.fallback;

/**
 * Normalize text for matching
 * Converts to lowercase and removes punctuation
 *
 * @param text - The input text to normalize
 * @returns Normalized string
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

/**
 * Check if query matches any greeting keywords
 *
 * @param query - User's message
 * @returns Greeting response or null
 */
function checkGreeting(query: string): string | null {
  const normalized = normalizeText(query);
  const words = normalized.split(/\s+/);

  for (const keyword of greetings.keywords) {
    if (words.includes(keyword) || normalized.includes(keyword)) {
      return greetings.response;
    }
  }
  return null;
}

/**
 * Check if query is a thank you message
 *
 * @param query - User's message
 * @returns Thanks response or null
 */
function checkThanks(query: string): string | null {
  const normalized = normalizeText(query);

  for (const keyword of thanks.keywords) {
    if (normalized.includes(keyword)) {
      return thanks.response;
    }
  }
  return null;
}

/**
 * Check if query is a goodbye message
 *
 * @param query - User's message
 * @returns Goodbye response or null
 */
function checkGoodbye(query: string): string | null {
  const normalized = normalizeText(query);

  for (const keyword of goodbye.keywords) {
    if (normalized.includes(keyword)) {
      return goodbye.response;
    }
  }
  return null;
}

/**
 * Search local FAQ database for matching answer
 * Uses keyword matching with scoring system
 *
 * MATCHING ALGORITHM:
 * - Exact word match: +2 points
 * - Partial match (keyword in query): +1 point
 * - Returns FAQ with highest score (minimum 1 point required)
 *
 * @param query - User's message
 * @returns Matching FAQ answer or null
 */
function searchLocalFaq(query: string): string | null {
  const normalized = normalizeText(query);
  const queryWords = new Set(normalized.split(/\s+/));

  let bestMatch: FAQ | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    let score = 0;

    for (const keyword of faq.keywords) {
      const keywordLower = keyword.toLowerCase();

      // Exact word match - higher score
      if (queryWords.has(keywordLower)) {
        score += 2;
      }
      // Partial match - keyword appears in query
      else if (normalized.includes(keywordLower)) {
        score += 1;
      }
    }

    // Update best match if this FAQ has higher score
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  // Return match only if score is above threshold
  if (bestScore >= 1 && bestMatch) {
    return bestMatch.answer;
  }

  return null;
}

/**
 * Get answer for a Quick Question
 * This function fetches from LOCAL DATA ONLY - no API call!
 *
 * TOKEN SAVING: Quick Questions are pre-defined and always
 * return from local database, never calling Gemini API.
 *
 * @param questionText - The quick question text
 * @returns Answer from local FAQ data
 */
export function getQuickAnswer(questionText: string): string | null {
  // First, try to find by exact question match in Quick Questions
  const quickQ = quickQuestions.find(
    (q) => q.text.toLowerCase() === questionText.toLowerCase()
  );

  if (quickQ) {
    // Find the FAQ by ID
    const faq = faqs.find((f) => f.id === quickQ.faqId);
    if (faq) {
      return faq.answer;
    }
  }

  // Fallback: Search by question text in FAQs
  for (const faq of faqs) {
    if (faq.question.toLowerCase() === questionText.toLowerCase()) {
      return faq.answer;
    }
  }

  // Last resort: Use keyword search
  return searchLocalFaq(questionText);
}

/**
 * Main response function
 * Orchestrates the LOCAL-FIRST response strategy
 *
 * RESPONSE PRIORITY:
 * 1. Greetings (hi, hello)
 * 2. Thanks (thank you, shukriya)
 * 3. Goodbye (bye, khuda hafiz)
 * 4. Local FAQ search
 * 5. Fallback message
 *
 * @param userMessage - The user's input message
 * @returns Promise resolving to the bot's response
 */
export async function getResponse(userMessage: string): Promise<string> {
  // Step 1: Check for greeting
  const greetingResponse = checkGreeting(userMessage);
  if (greetingResponse) {
    return greetingResponse;
  }

  // Step 2: Check for thanks
  const thanksResponse = checkThanks(userMessage);
  if (thanksResponse) {
    return thanksResponse;
  }

  // Step 3: Check for goodbye
  const goodbyeResponse = checkGoodbye(userMessage);
  if (goodbyeResponse) {
    return goodbyeResponse;
  }

  // Step 4: Search local FAQ database
  const faqResponse = searchLocalFaq(userMessage);
  if (faqResponse) {
    return faqResponse;
  }

  // Step 5: Return fallback message
  // TODO: Integrate Gemini API call here for unknown queries
  return fallback.response;
}

// Export quick questions for UI
export { quickQuestions };
export type { QuickQuestion };
