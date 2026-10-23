/** Maps website enquiry forms onto the Simply Admission lead API. */

export const SIMPLY_ADMISSION_URL = "https://ekaaya.simplyadmission.com/integration/webEnquiryData";
export const ACADEMIC_YEAR = "2027-28";

/** Custom field from the school's Simply Admission sample request. It stores the form source. */
export const SOURCE_UDF = "udf_AQYJBOUJCGNZOZVJGFYAVHRQSKWMEW";
const SECTION_NAME_UDF = "udf_JQFIQWACOKFZASGRXBKHANWJNAVWDA";
const FORM_NAME_UDF = "udf_MENENADGOKAXDHCXHBPRKRQYRWKARQ";

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

/** Extra query params from the Google Ads landing URL. */
const EXTRA_PARAMS: Record<string, readonly string[]> = {
  utm_device: ["utm_Device", "utm_device", "UTM_Device"],
  gclid: ["gclid", "GCLID"],
  utm_gender: ["utm_Gender", "utm_gender", "UTM_Gender"],
  utm_household_income: ["utm_HouseholdIncome", "utm_householdincome", "UTM_HouseholdIncome"],
  utm_age_group: ["utm_AgeGroup", "utm_agegroup", "UTM_AgeGroup"],
};

/** Choice fields. The value must be one of the options saved in Simply Admission. */
const LEAD_SOURCE_CATEGORY = "udf_GKVCPLBVSMLDOZOLTEWWDMDRFFJSPH";
const LEAD_SOURCE = "udf_OGLFUXYRCBMQWKOBHPKIPXTGHTRFAP";
const LEAD_MEDIUM = "udf_XFNEPCTAIODGPIJFWGFDBFBAFMKOLD";

/** Text fields. Campaign, keyword, creative, click id, and device stay here. */
const CRM_TEXT_FIELDS = [
  { udf: "udf_RXRFEWGKFDNGZGCGWWEVJULGDVONRE", from: "utm_term", max: 200 },
  { udf: "udf_AQWGRQBVUIUGWKPQRVHIIVTWWLHYFU", from: "utm_content", max: 200 },
  { udf: "udf_RSQQZWIRYBBIAKSPDIPKFXLWFDLEGS", from: "formUrl", max: 1000 },
  { udf: "udf_TLWZSXLNVEBCGGZEPBASLNZRLZRIRC", from: "gclid", max: 500 },
  { udf: "udf_XHPEKCQKBWIVLUWHTGEYULDJNMOJDP", from: "utm_device", max: 200 },
  { udf: "udf_QTRGBYMJKKXGMKXAXZCMTCJMPHFEMD", from: "utm_gender", max: 200 },
  { udf: "udf_JOSMRAABQDLGCRICPUZVFVHCIILOMP", from: "utm_household_income", max: 200 },
  { udf: "udf_MLCWLSINAKLYUTGFYHTQSDSBKEMDCH", from: "utm_age_group", max: 200 },
] as const;

/** Website enquiries are form fills. Lead Source is only set when the click matches a saved option. */
function leadSourceChoice(utm: Record<string, string>): string | undefined {
  const source = [utm.utm_source, utm.UTM_Source].find((item) => item?.trim())?.trim().toLowerCase() ?? "";
  const gclid = trackingValue(utm.gclid ?? utm.GCLID, 500);
  if (/facebook|instagram|\bmeta\b|\bfb\b/.test(source)) return "Facebook Ads";
  if (/google|adwords/.test(source) || gclid) return "Google Ads";
  return undefined;
}

export type EnquiryInput = {
  name: string;
  phone: string;
  email?: string;
  grade: string;
  sourceName: string;
  sectionName?: string;
  formName?: string;
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

function trackingValue(raw: string | null | undefined, max: number): string | undefined {
  const value = raw?.trim();
  if (!value || /^\{.+\}$/.test(value)) return undefined;
  return value.slice(0, max);
}

function readParam(params: URLSearchParams, aliases: readonly string[], max: number): string | undefined {
  for (const alias of aliases) {
    const value = trackingValue(params.get(alias), max);
    if (value) return value;
  }
  return undefined;
}

/** Reads UTM params, gclid, device, audience fields, and the page URL from the current page. */
export function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = readParam(params, UTM_ALIASES[key], 200);
    if (value) out[key] = value;
  }
  for (const [key, aliases] of Object.entries(EXTRA_PARAMS)) {
    const value = readParam(params, aliases, key === "gclid" ? 500 : 200);
    if (value) out[key] = value;
  }
  const formUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`.slice(0, 1000);
  if (formUrl) out.formUrl = formUrl;
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
  const sectionName = input.sectionName?.trim().slice(0, 200);
  const formName = input.formName?.trim().slice(0, 200);
  if (sectionName) body[SECTION_NAME_UDF] = sectionName;
  if (formName) body[FORM_NAME_UDF] = formName;
  if (phone) body["mobileNo"] = phone;
  if (email) body["emailId"] = email;

  const remarks = (input.note ?? "").trim().slice(0, 500);
  if (remarks) body["remarks"] = remarks;

  const utm = input.utm ?? {};
  for (const key of UTM_KEYS) {
    const value = trackingValue(
      UTM_ALIASES[key].map((alias) => utm[alias]).find((item) => item?.trim()),
      200,
    );
    if (value) body[key] = value;
  }

  body[LEAD_SOURCE_CATEGORY] = "Form Fill";
  body[LEAD_MEDIUM] = "Form Fill, Whatsapp";
  const leadSource = leadSourceChoice(utm);
  if (leadSource) body[LEAD_SOURCE] = leadSource;

  for (const field of CRM_TEXT_FIELDS) {
    const aliases =
      field.from in UTM_ALIASES
        ? UTM_ALIASES[field.from as (typeof UTM_KEYS)[number]]
        : field.from in EXTRA_PARAMS
          ? EXTRA_PARAMS[field.from]
          : [field.from];
    const value = trackingValue(
      aliases.map((alias) => utm[alias]).find((item) => item?.trim()),
      field.max,
    );
    if (value) body[field.udf] = value;
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
