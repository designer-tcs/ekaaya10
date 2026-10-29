/** Scripted admissions chatbot. Button labels and replies follow the Ekaaya flow. */

export const PREFILL_PROMPTS = [
  "I want to know more.",
  "Tell me more about Ekaaya.",
  "Learn more about Ekaaya.",
  "Admission details please!",
] as const;

/** Shown as the visitor's first message when an ad does not pass its own prefill. */
export const DEFAULT_PREFILL = "I want to know more.";

export type StepId =
  | "welcome"
  | "different"
  | "academics"
  | "campus"
  | "sports"
  | "fees"
  | "counsellor"
  | "visit"
  | "lead-academics"
  | "lead-sports"
  | "visit-form"
  | "thanks-fees"
  | "thanks-callback"
  | "thanks-enquiry"
  | "thanks-visit"
  | "contact"
  | "fallback";

export type Choice = { label: string; to: StepId };

export type FormSpec = {
  kind: "enquiry" | "visit";
  submitLabel: string;
  sourceName: "Quick Enquiry" | "Book My Visit";
  sectionName: string;
  formName: string;
  thanks: StepId;
};

export type Step = {
  id: StepId;
  text: string;
  /** Sits with the option buttons, in a different voice from the message. */
  optionsTitle?: string;
  choices?: Choice[];
  form?: FormSpec;
};

const FORM_INTRO = "Let's help you take the next step towards Ekaaya.";
const MORE_TITLE = "What more would you like to know?";
const ELSE_TITLE = "What else would you like to know?";

const WELCOME_CHOICES: Choice[] = [
  { label: "What Makes Ekaaya Different?", to: "different" },
  { label: "Fee Details", to: "fees" },
  { label: "Speak to a Counsellor", to: "counsellor" },
  { label: "Schedule a Campus Visit", to: "visit" },
];

/** Readable note the CRM remarks field already stores for the admissions team. */
export function chatLeadNote(
  spec: FormSpec,
  details: { child: string; email: string; when?: string; slot?: string },
): string {
  const parts = [`Enquiry: ${spec.formName}`, `Child: ${details.child}`];
  if (details.email) parts.push(`Email: ${details.email}`);
  if (spec.kind === "visit" && details.when && details.slot) parts.push(`Visit: ${details.when} ${details.slot}`);
  return parts.join(" · ").slice(0, 500);
}

const enquiryForm = (sectionName: string, formName: string, thanks: StepId): FormSpec => ({
  kind: "enquiry",
  submitLabel: "Submit Enquiry",
  sourceName: "Quick Enquiry",
  sectionName,
  formName,
  thanks,
});

export const STEPS: Record<StepId, Step> = {
  welcome: {
    id: "welcome",
    text: [
      "Welcome to Ekaaya International School!",
      "A school where academic excellence meets meaningful experiences, preparing children to become competent, compassionate and conscious individuals.",
      "Admissions Open | Pre-K to Grade 4",
    ].join("\n\n"),
    optionsTitle: MORE_TITLE,
    choices: WELCOME_CHOICES,
  },
  different: {
    id: "different",
    text: "Because a great education is about everything your child learns, experiences and becomes.",
    optionsTitle: "What more would you like to know about what makes Ekaaya different?",
    choices: [
      { label: "Academics & Learning", to: "academics" },
      { label: "Campus & Infrastructure", to: "campus" },
      { label: "Sports & Holistic Development", to: "sports" },
    ],
  },
  academics: {
    id: "academics",
    text: [
      "We don't just teach children what to think. We teach them how to think.",
      "📚 Strong Academic Foundations – A rigorous curriculum that builds conceptual clarity and independent thinking.",
      "🔬 STEAM & Robotics – Hands-on exploration that connects classroom learning with practical applications.",
      "💡 Life Lab – Learning essential life skills through meaningful experiences.",
      "🚀 I-ACT Programme – Developing initiative, enterprise and leadership from an early age.",
      "🗳️ Student Voice – Encouraging responsibility, participation and decision-making.",
    ].join("\n\n"),
    optionsTitle: MORE_TITLE,
    choices: [{ label: "Enquire About Academics", to: "lead-academics" }],
  },
  campus: {
    id: "campus",
    text: [
      "A thoughtfully designed campus where every space creates an opportunity to learn.",
      "🌿 Open, Green Campus – Natural light, courtyards and outdoor environments designed for exploration.",
      "🏫 Purposeful Classrooms – Learning spaces that encourage curiosity, participation and collaboration.",
      "🌳 Outdoor Learning Zones – Amra Canopy, Marmar Woods, Jan Path and The Atelier.",
      "🔬 Dedicated Learning Spaces – STEAM & Robotics Lab, Art Studio and Pottery Studio.",
      "📚 Casita Library – A space that nurtures reading, discovery and imagination.",
      "🌱 Soil Lab – Organic farming and experiential learning through nature.",
      "🎭 Vyoma – An open-air space for music, performances and expression.",
    ].join("\n\n"),
    optionsTitle: MORE_TITLE,
    choices: [{ label: "Schedule a Campus Visit", to: "visit-form" }],
  },
  sports: {
    id: "sports",
    text: [
      "Because your child's potential extends far beyond the classroom.",
      "⚽ Outdoor Sports – Football, cricket, basketball, volleyball and athletics.",
      "🏸 Indoor Sports – Badminton, table tennis and martial arts to name a few.",
      "🏅 Structured Sports Development – Guided by a dedicated Sports Coordinator.",
      "🎨 Creative Expression – Music, dance, drama, art and pottery.",
      "💛 Social-Emotional Learning – Building empathy, resilience, confidence and self-awareness.",
      "🌍 Character & Life Skills – Developing responsible, compassionate and conscious individuals.",
      "🎤 Performance Opportunities – Ekaaya Fest, Spotlight and the Annual Concert.",
    ].join("\n\n"),
    optionsTitle: MORE_TITLE,
    choices: [{ label: "Discover More About Ekaaya", to: "lead-sports" }],
  },
  fees: {
    id: "fees",
    text: [
      "The right school is an investment in your child's future.",
      "Our admissions team will be happy to share the fee structure and guide you through the academic offerings for your child's grade.",
      "Please share a few details to receive the relevant information.",
      FORM_INTRO,
    ].join("\n\n"),
    form: enquiryForm("Chatbot Fee Details", "Fee Details", "thanks-fees"),
  },
  counsellor: {
    id: "counsellor",
    text: [
      "Every child is different. Every parent's questions deserve personal attention.",
      "Connect with our admissions team to understand Ekaaya's curriculum, facilities, learning approach and admission process.",
      "Please share your details, and we will arrange a callback.",
      FORM_INTRO,
    ].join("\n\n"),
    form: enquiryForm("Chatbot Counsellor", "Speak to a Counsellor", "thanks-callback"),
  },
  visit: {
    id: "visit",
    text: [
      "The best way to understand Ekaaya is to experience it.",
      "Explore our learning spaces, meet our educators and discover the environment your child could grow in.",
      "📍 Ekaaya International School, Bill Sokhda Road, Vadodara",
      "🗓️ Campus visits available on weekdays and Saturdays.",
    ].join("\n\n"),
    optionsTitle: MORE_TITLE,
    choices: [{ label: "Book My Campus Visit", to: "visit-form" }],
  },
  "lead-academics": {
    id: "lead-academics",
    text: FORM_INTRO,
    form: enquiryForm("Chatbot Academics", "Enquire About Academics", "thanks-enquiry"),
  },
  "lead-sports": {
    id: "lead-sports",
    text: FORM_INTRO,
    form: enquiryForm("Chatbot Sports", "Discover More About Ekaaya", "thanks-enquiry"),
  },
  "visit-form": {
    id: "visit-form",
    text: [
      "📍 Ekaaya International School, Bill Sokhda Road, Vadodara",
      "🗓️ Campus visits available on weekdays and Saturdays.",
      FORM_INTRO,
    ].join("\n\n"),
    form: {
      kind: "visit",
      submitLabel: "Confirm Visit Request",
      sourceName: "Book My Visit",
      sectionName: "Chatbot Campus Visit",
      formName: "Book My Campus Visit",
      thanks: "thanks-visit",
    },
  },
  "thanks-fees": {
    id: "thanks-fees",
    text: [
      "Thank you for your interest in Ekaaya!",
      "Our admissions team will contact you with the fee details and assist you with the next steps.",
    ].join("\n\n"),
    optionsTitle: ELSE_TITLE,
    choices: WELCOME_CHOICES,
  },
  "thanks-callback": {
    id: "thanks-callback",
    text: [
      "Thank you! Your callback request has been received.",
      "Our admissions team will contact you to address your questions and guide you further.",
    ].join("\n\n"),
    optionsTitle: ELSE_TITLE,
    choices: WELCOME_CHOICES,
  },
  "thanks-enquiry": {
    id: "thanks-enquiry",
    text: [
      "Thank you for your interest in Ekaaya!",
      "Our admissions team will contact you and assist you with the next steps.",
    ].join("\n\n"),
    optionsTitle: ELSE_TITLE,
    choices: WELCOME_CHOICES,
  },
  "thanks-visit": {
    id: "thanks-visit",
    text: [
      "Thank you for scheduling a visit to Ekaaya!",
      "Our admissions team will contact you to confirm your preferred date and time.",
      "We look forward to welcoming you.",
    ].join("\n\n"),
    optionsTitle: ELSE_TITLE,
    choices: WELCOME_CHOICES,
  },
  contact: {
    id: "contact",
    text: [
      "We would be delighted to assist you.",
      "📞 +91 88663 52292",
      "✉️ info@ekaaya.education",
      "📍 Sokhdakhurd, Bill Sokhda Road, near Dadapura Crossing, Vadodara",
      "🌐 www.ekaaya.education",
    ].join("\n"),
    optionsTitle: ELSE_TITLE,
    choices: WELCOME_CHOICES,
  },
  fallback: {
    id: "fallback",
    text: "Please choose an option below.",
    optionsTitle: MORE_TITLE,
    choices: WELCOME_CHOICES,
  },
};

const DETAIL_STEPS = new Set<StepId>(["academics", "campus", "sports"]);

/** After a topic description, offer its action, the other topics not yet opened, and the other main paths. */
export function choicesFor(stepId: StepId, visited: readonly StepId[]): Choice[] {
  const own = STEPS[stepId].choices ?? [];
  if (!DETAIL_STEPS.has(stepId)) return own;

  const seen = new Set<StepId>([...visited, stepId]);
  const topics = (STEPS.different.choices ?? []).filter((choice) => !seen.has(choice.to));
  const elsewhere = WELCOME_CHOICES.filter((choice) => choice.to !== "different" && !seen.has(choice.to));
  const merged: Choice[] = [];
  const labels = new Set<string>();
  for (const choice of [...own, ...topics, ...elsewhere]) {
    if (labels.has(choice.label)) continue;
    labels.add(choice.label);
    merged.push(choice);
  }
  return merged;
}

/** Same visit slots the campus tour page already offers. */
export const VISIT_SLOTS = ["9:30 – 10:30 AM", "11:00 AM – 12:00 PM", "3:00 – 4:00 PM"] as const;

const EXACT: Record<string, StepId> = {
  "what makes ekaaya different": "different",
  "fee details": "fees",
  "speak to a counsellor": "counsellor",
  "speak to a counselor": "counsellor",
  "schedule a campus visit": "visit",
  "academics & learning": "academics",
  "academics and learning": "academics",
  "campus & infrastructure": "campus",
  "campus and infrastructure": "campus",
  "sports & holistic development": "sports",
  "sports and holistic development": "sports",
  "enquire about academics": "lead-academics",
  "discover more about ekaaya": "lead-sports",
  "book my campus visit": "visit-form",
  "i want to know more": "welcome",
  "tell me more about ekaaya": "welcome",
  "learn more about ekaaya": "welcome",
  "admission details please": "welcome",
  contact: "contact",
  "main menu": "welcome",
};

export function normalizeChatText(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ");
}

/** Maps a typed message or ad prefill onto a step. Unrecognised text returns null. */
export function resolveIncoming(input: string): StepId | null {
  const text = normalizeChatText(input);
  if (!text) return null;
  const exact = EXACT[text];
  if (exact) return exact;

  if (/\b(fee|fees)\b/.test(text)) return "fees";
  if (/counsellor|counselor|callback/.test(text)) return "counsellor";
  if (/academic/.test(text)) return "academics";
  if (/\b(sport|sports|holistic)\b/.test(text)) return "sports";
  if (/\b(visit|tour)\b/.test(text)) return "visit";
  if (/infrastructure|\blibrary\b|\bsteam\b/.test(text)) return "campus";
  if (/\bcampus\b/.test(text)) return "campus";
  if (/different|why ekaaya|unique/.test(text)) return "different";
  if (/\b(contact|phone|email|address)\b/.test(text)) return "contact";
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(text)) return "welcome";
  if (/\badmission\b/.test(text)) return "welcome";
  return null;
}

export type TranscriptLine = {
  role: "user" | "bot";
  text: string;
  stepId?: StepId;
};

/** First screen of the chat. "I want to know more." and the other ad prefills open the welcome flow. */
export function openingTranscript(prefill?: string): { lines: TranscriptLine[]; stepId: StepId } {
  const welcome: TranscriptLine = { role: "bot", text: STEPS.welcome.text, stepId: "welcome" };
  const text = prefill?.trim().slice(0, 300);
  if (!text) return { lines: [welcome], stepId: "welcome" };

  const next = resolveIncoming(text) ?? "fallback";
  const user: TranscriptLine = { role: "user", text };
  const step = STEPS[next];
  return {
    lines: [user, { role: "bot", text: step.text, stepId: next }],
    stepId: next,
  };
}
