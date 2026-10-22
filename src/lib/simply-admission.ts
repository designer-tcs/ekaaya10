/** Maps website enquiry forms onto the Simply Admission lead API. */

export const SIMPLY_ADMISSION_URL = "https://ekaaya.simplyadmission.com/integration/webEnquiryData";
export const ACADEMIC_YEAR = "2027-28";

/** Custom field from the school's Simply Admission sample request. It stores the form source. */
export const SOURCE_UDF = "udf_AQYJBOUJCGNZOZVJGFYAVHRQSKWMEW";

export const CRM_SOURCES = ["Quick Enquiry", "Book a Tour", "Book My Visit"] as const;
export type CrmSource = (typeof CRM_SOURCES)[number];

export const ADMISSION_CLASSES = [
  "Nursery",
  "Junior KG",
  "Senior KG",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
] as const;

export const EARLY_YEARS_CLASSES = [
  { value: "Nursery", label: "Nursery (ages 3–4)" },
  { value: "Junior KG", label: "Junior KG (ages 4–5)" },
  { value: "Senior KG", label: "Senior KG (ages 5–6)" },
] as const;

const CLASS_ALIASES: Record<string, (typeof ADMISSION_CLASSES)[number]> = {
  nursery: "Nursery",
  "jr.kg": "Junior KG",
  "jr kg": "Junior KG",
  "junior kg": "Junior KG",
  "sr.kg": "Senior KG",
  "sr kg": "Senior KG",
  "senior kg": "Senior KG",
  "pre-k / nursery (3–4)": "Nursery",
  "pre-k / nursery (3-4)": "Nursery",
  "kg (4–6)": "Junior KG",
  "kg (4-6)": "Junior KG",
  "grade 1": "Grade 1",
  "grade 2": "Grade 2",
  "grade 3": "Grade 3",
  "grade 4": "Grade 4",
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const UTM_ALIASES: Record<(typeof UTM_KEYS)[number], readonly string[]> = {
  utm_source: ["utm_source", "UTM_Source"],
  utm_medium: ["utm_medium", "UTM_Medium"],
  utm_campaign: ["utm_campaign", "UTM_Campaign"],
  utm_term: ["utm_term", "UTM_Term"],
  utm_content: ["utm_content", "UTM_Content"],
};

export type EnquiryInput = {
  name: string;
  phone: string;
  email?: string;
  grade: string;
  sourceName: string;
  note?: string;
  utm?: Record<string, string>;
};

export type PreparedLead = {
  ok: true;
  name: string;
  phone: string;
  email: string;
  grade: string;
  body: Record<string, string>;
};

export function normalizeMobile(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return null;
}

export function mapClass(input: string): (typeof ADMISSION_CLASSES)[number] | null {
  const key = input.trim().toLowerCase().replace(/\s+/g, " ");
  return CLASS_ALIASES[key] ?? null;
}

export function isCrmSource(input: string): input is CrmSource {
  return (CRM_SOURCES as readonly string[]).includes(input);
}

export function isEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

/** Reads UTM params from the current page and returns them as utm_source, utm_medium, and so on. */
export function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    for (const alias of UTM_ALIASES[key]) {
      const value = params.get(alias)?.trim();
      if (value) {
        out[key] = value.slice(0, 200);
        break;
      }
    }
  }
  return out;
}

export function prepareLead(input: EnquiryInput): PreparedLead | { ok: false; error: string } {
  const name = input.name.trim().slice(0, 100);
  if (!name) return { ok: false, error: "Please enter your name." };

  const phone = normalizeMobile(input.phone);
  const email = (input.email ?? "").trim().slice(0, 255);
  if (email && !isEmail(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!phone && !email) return { ok: false, error: "Please enter a mobile number or email address." };
  if (input.phone.trim() && !phone) return { ok: false, error: "Please enter a 10-digit mobile number." };

  const grade = mapClass(input.grade);
  if (!grade) return { ok: false, error: "Please choose a class." };

  if (!isCrmSource(input.sourceName)) return { ok: false, error: "Please check your details and try again." };

  const body: Record<string, string> = {
    name,
    acadyearName: ACADEMIC_YEAR,
    className: grade,
    sourceName: input.sourceName,
    [SOURCE_UDF]: input.sourceName,
  };
  if (phone) body["mobileNo"] = phone;
  if (email) body["emailId"] = email;

  const remarks = (input.note ?? "").trim().slice(0, 500);
  if (remarks) body["remarks"] = remarks;

  for (const key of UTM_KEYS) {
    const value = UTM_ALIASES[key].map((alias) => input.utm?.[alias]?.trim()).find(Boolean);
    if (value) body[key] = value.slice(0, 200);
  }

  return { ok: true, name, phone: phone ?? "", email, grade, body };
}

type CrmJson = {
  status?: boolean | number;
  message?: string;
  error_message?: string;
};

export async function postEnquiry(
  body: Record<string, string>,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!apiKey) return { ok: false, error: "Please check your details and try again." };

  let response: Response;
  try {
    response = await fetchImpl(SIMPLY_ADMISSION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, error: "Please check your details and try again." };
  }

  let payload: CrmJson = {};
  try {
    payload = (await response.json()) as CrmJson;
  } catch {
    return { ok: false, error: "Please check your details and try again." };
  }

  if (payload.error_message || payload.status === false) {
    return { ok: false, error: "Please check your details and try again." };
  }

  if (payload.status === 200 || payload.status === true) return { ok: true };
  return { ok: false, error: "Please check your details and try again." };
}
