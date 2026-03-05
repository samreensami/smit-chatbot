/**
 * Local FAQ Database for SMIT
 * Organized by categories to save API tokens
 */

export interface FAQ {
  category: string;
  keywords: string[];
  question: string;
  answer: string;
}

export interface QuickQuestion {
  text: string;
  category: string;
}

export const categories = {
  admissions: { name: "Admissions", description: "How to apply, eligibility criteria" },
  courses: { name: "Courses", description: "Available programs, duration, timings" },
  events: { name: "Events & Announcements", description: "Workshops, hackathons" },
  fees: { name: "Fees & Certificates", description: "Cost, certificates, placement" },
  general: { name: "General Information", description: "Contact, locations" },
};

export const faqs: FAQ[] = [
  // ADMISSIONS
  {
    category: "admissions",
    keywords: ["admission", "apply", "enroll", "join", "register", "registration", "dakhla", "how to apply"],
    question: "How to apply for admission?",
    answer: "To apply for SMIT admission:\n\n1. Visit saylaniwelfare.com/smit\n2. Click on 'Apply Now' or 'Admissions'\n3. Fill out the online registration form\n4. Upload required documents (CNIC, photo, education certificates)\n5. Select your preferred course and city\n6. Submit and wait for the test/interview call\n\nAdmissions are usually open throughout the year!",
  },
  {
    category: "admissions",
    keywords: ["eligibility", "requirement", "requirements", "qualification", "criteria", "who can", "eligible"],
    question: "What are the eligibility requirements?",
    answer: "SMIT eligibility requirements:\n\n• Minimum education: Matric/O-Levels (varies by course)\n• Age: Usually 18-35 years\n• Basic computer knowledge is helpful but not required\n• Pakistani CNIC/B-Form\n• Commitment to attend classes regularly\n\nSome advanced courses may require intermediate or graduation.",
  },
  {
    category: "admissions",
    keywords: ["document", "documents", "required", "needed", "papers"],
    question: "What documents are required?",
    answer: "Documents required for SMIT admission:\n\n• Copy of CNIC (front & back)\n• Recent passport-size photograph\n• Last educational certificate/marksheet\n• Domicile (if available)\n\nBring original documents for verification during the interview.",
  },

  // COURSES
  {
    category: "courses",
    keywords: ["course", "courses", "program", "programs", "learn", "study", "offer", "available"],
    question: "What courses are available?",
    answer: "SMIT offers various IT courses:\n\n• Web Development (HTML, CSS, JavaScript, React)\n• Mobile App Development (Flutter, React Native)\n• MERN Stack (MongoDB, Express, React, Node.js)\n• Python Programming & Data Science\n• AI & Machine Learning\n• Graphic Design & UI/UX\n• Digital Marketing\n• Cyber Security\n• Video Editing & Animation\n• E-commerce & Amazon FBA",
  },
  {
    category: "courses",
    keywords: ["duration", "time", "long", "months", "length", "period", "kitna"],
    question: "What is the duration of courses?",
    answer: "Course durations at SMIT:\n\n• Short courses: 3-4 months\n• Standard courses: 6-8 months\n• Advanced/Complete courses: 9-12 months\n\nClasses are usually held 3-4 days a week, with each session lasting 2-3 hours.",
  },
  {
    category: "courses",
    keywords: ["timing", "timings", "schedule", "shift", "hours", "batch", "morning", "evening"],
    question: "What are the class timings?",
    answer: "SMIT offers multiple shift timings:\n\n• Morning Batch: 9:00 AM - 12:00 PM\n• Afternoon Batch: 2:00 PM - 5:00 PM\n• Evening Batch: 6:00 PM - 9:00 PM\n\nClasses are typically held 3-4 days a week. You can choose your preferred shift during registration.",
  },

  // EVENTS
  {
    category: "events",
    keywords: ["workshop", "workshops", "training", "bootcamp", "event", "events"],
    question: "Are there any workshops available?",
    answer: "Yes! SMIT regularly conducts:\n\n• Weekend Workshops (Web Dev, Mobile Apps)\n• Bootcamps (Intensive 1-2 week programs)\n• Guest Speaker Sessions (Industry experts)\n• Career Counseling Sessions\n\nFollow SMIT on social media or check the website for upcoming workshop announcements!",
  },
  {
    category: "events",
    keywords: ["hackathon", "competition", "contest", "coding"],
    question: "Does SMIT organize hackathons?",
    answer: "Yes! SMIT organizes various tech events:\n\n• Annual Hackathons for students\n• Coding Competitions\n• Project Showcases\n• Tech Fairs\n\nThese events help students gain practical experience and showcase their skills. Winners often receive prizes and recognition!",
  },
  {
    category: "events",
    keywords: ["announcement", "announcements", "news", "update", "latest"],
    question: "How can I stay updated with announcements?",
    answer: "Stay updated with SMIT announcements:\n\n• Website: saylaniwelfare.com/smit\n• Facebook: @smikiofficial\n• Instagram: @smikiofficial\n• WhatsApp Groups (Join after enrollment)\n• Campus Notice Boards\n\nWe regularly post about new courses, events, and opportunities!",
  },

  // FEES & CERTIFICATES
  {
    category: "fees",
    keywords: ["fee", "fees", "cost", "price", "payment", "free", "charge", "money", "paisa"],
    question: "Is SMIT free?",
    answer: "Yes! SMIT courses are completely FREE!\n\nSaylani Welfare Trust provides 100% free IT education. There are no tuition fees, no hidden charges. Some campuses may require a small refundable security deposit (Rs. 1000-2000) which is returned upon course completion.",
  },
  {
    category: "fees",
    keywords: ["certificate", "certification", "degree", "diploma", "certificates"],
    question: "Do you give certificates?",
    answer: "Yes! Upon successful completion, you receive:\n\n• Official SMIT Certificate\n• Industry-recognized credentials\n• Some courses offer international certification prep\n\nRequirements: 80%+ attendance and passing the final assessment.",
  },
  {
    category: "fees",
    keywords: ["job", "jobs", "placement", "career", "employment", "hire", "naukri"],
    question: "Does SMIT help with job placement?",
    answer: "Yes! SMIT provides career support:\n\n• Job placement assistance\n• Interview preparation workshops\n• Resume/CV building sessions\n• LinkedIn profile optimization\n• Connections with hiring companies\n• Freelancing guidance (Upwork, Fiverr)\n\nMany graduates successfully start IT careers or freelancing!",
  },

  // GENERAL
  {
    category: "general",
    keywords: ["location", "address", "where", "city", "cities", "campus", "branch", "kahan", "located"],
    question: "Where is SMIT located?",
    answer: "SMIT has campuses across Pakistan:\n\n• Karachi: Bahadurabad, Gulshan, North Nazimabad, Korangi\n• Lahore: Multiple branches\n• Islamabad/Rawalpindi\n• Faisalabad\n• Multan\n• Hyderabad\n• Peshawar\n• Quetta\n\nVisit saylaniwelfare.com to find your nearest campus!",
  },
  {
    category: "general",
    keywords: ["contact", "phone", "email", "number", "helpline", "reach"],
    question: "How can I contact SMIT?",
    answer: "Contact SMIT:\n\n• Website: saylaniwelfare.com/smit\n• Helpline: 0800-786-786\n• Email: info@saylaniwelfare.com\n• Visit nearest campus\n• Social Media: @smikiofficial\n\nCampus staff are available during working hours for queries.",
  },
  {
    category: "general",
    keywords: ["laptop", "computer", "device", "system", "pc"],
    question: "Do I need a laptop?",
    answer: "Having a laptop is recommended but NOT required!\n\n• SMIT provides computer labs for practice\n• Lab access during class hours\n• Many students complete courses using only lab computers\n\nIf possible, having your own laptop helps with home practice and assignments.",
  },
  {
    category: "general",
    keywords: ["online", "remote", "home", "virtual"],
    question: "Are online classes available?",
    answer: "SMIT primarily offers on-campus physical classes for hands-on learning. However:\n\n• Some courses have online components\n• Recorded lectures may be available\n• Hybrid options during special circumstances\n\nPhysical attendance is recommended for the best learning experience.",
  },
  {
    category: "general",
    keywords: ["saylani", "welfare", "trust", "organization"],
    question: "What is Saylani Welfare Trust?",
    answer: "Saylani Welfare International Trust:\n\n• One of Pakistan's largest welfare organizations\n• Founded by Maulana Bashir Farooqi\n• Provides: Free food (Dastarkhwan), Education, Healthcare\n• SMIT is the IT education wing\n• 100% donation-funded\n• Serves humanity regardless of religion or background",
  },
];

export const quickQuestions: QuickQuestion[] = [
  { text: "How to apply for admission?", category: "admissions" },
  { text: "What courses are available?", category: "courses" },
  { text: "Is SMIT free?", category: "fees" },
  { text: "Where is SMIT located?", category: "general" },
  { text: "What are the class timings?", category: "courses" },
  { text: "Do you give certificates?", category: "fees" },
];

/**
 * Find answer for a quick question (exact match)
 */
export function getQuickAnswer(questionText: string): string | null {
  const normalizedQuestion = questionText.toLowerCase().trim();

  for (const faq of faqs) {
    if (faq.question.toLowerCase() === normalizedQuestion) {
      return faq.answer;
    }
  }

  // Partial match
  for (const faq of faqs) {
    if (normalizedQuestion.includes(faq.question.toLowerCase().split("?")[0])) {
      return faq.answer;
    }
  }

  return null;
}
