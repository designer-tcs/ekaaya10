import { createFileRoute } from "@tanstack/react-router";
import { AdmissionsChat } from "@/components/admissions-chat";
import { EARLY_YEARS_CLASSES } from "@/lib/simply-admission";
import { admissionsSearch } from "@/routes/admissions";
import { EarlyYearsPage } from "@/routes/early-years";

export const Route = createFileRoute("/admissions/early-years")({
  validateSearch: admissionsSearch,
  head: () => ({
    meta: [
      { title: "Early Years (Ages 3–6) | Ekaaya International School Vadodara" },
      {
        name: "description",
        content:
          "Play-based inquiry under the Amra canopy, a gentle home-to-school transition and dedicated caretaker attention for toddlers, nursery and kindergarten. Chat with admissions or book a discovery session.",
      },
      { property: "og:title", content: "Early Years at Ekaaya | Ages 3 to 6" },
      { property: "og:description", content: "Book an Early Years discovery session." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EarlyYearsChatPage,
});

function EarlyYearsChatPage() {
  const { prefill } = Route.useSearch();
  return (
    <EarlyYearsPage>
      <AdmissionsChat prefill={prefill} grades={EARLY_YEARS_CLASSES} gradeLabel="Child's class" />
    </EarlyYearsPage>
  );
}
