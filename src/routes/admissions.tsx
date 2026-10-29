import { Outlet, createFileRoute } from "@tanstack/react-router";

const TRACKING_KEYS = [
  "utm_source",
  "UTM_Source",
  "utm_medium",
  "UTM_Medium",
  "utm_campaign",
  "UTM_Campaign",
  "utm_term",
  "UTM_Term",
  "utm_content",
  "UTM_Content",
  "utm_Device",
  "utm_device",
  "UTM_Device",
  "gclid",
  "GCLID",
  "utm_Gender",
  "utm_gender",
  "UTM_Gender",
  "utm_HouseholdIncome",
  "utm_householdincome",
  "UTM_HouseholdIncome",
  "utm_AgeGroup",
  "utm_agegroup",
  "UTM_AgeGroup",
] as const;

export type ChatSearch = Partial<Record<(typeof TRACKING_KEYS)[number], string>>;

function keep(search: Record<string, unknown>, key: string, max: number): string | undefined {
  const value = search[key];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || /^\{.+\}$/.test(trimmed)) return undefined;
  return trimmed.slice(0, max);
}

export function admissionsSearch(search: Record<string, unknown>): ChatSearch {
  const out: ChatSearch = {};
  for (const key of TRACKING_KEYS) {
    const value = keep(search, key, key === "gclid" || key === "GCLID" ? 500 : 200);
    if (value) out[key] = value;
  }
  return out;
}

export const Route = createFileRoute("/admissions")({
  component: AdmissionsLayout,
});

function AdmissionsLayout() {
  return <Outlet />;
}
