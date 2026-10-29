import { createFileRoute } from "@tanstack/react-router";
import { AdmissionsChat } from "@/components/admissions-chat";
import { admissionsSearch } from "@/routes/admissions";
import { HomePage } from "@/routes/index";

export const Route = createFileRoute("/campus-vist")({
  validateSearch: admissionsSearch,
  head: () => ({
    meta: [
      { title: "Ekaaya International School Vadodara | Admissions Open Pre-K to Grade 4" },
      {
        name: "description",
        content:
          "Let them be. Let them become. Admissions open at Ekaaya International School, Sokhdakhurd, 30 mtr. Bill Sokhda Road, near Dadapura crossing, Vadodara for Pre-K to Grade 4. Chat with admissions or book a campus visit.",
      },
      { property: "og:title", content: "Ekaaya International School | Admissions Open" },
      { property: "og:description", content: "A place to become: competent, compassionate, conscious. Pre-K to Grade 4, Vadodara." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampusVistPage,
});

function CampusVistPage() {
  return (
    <HomePage>
      <AdmissionsChat />
    </HomePage>
  );
}
