import { createFileRoute } from "@tanstack/react-router";
import { AdmissionsChat } from "@/components/admissions-chat";
import { admissionsSearch } from "@/routes/admissions";
import { TourPage } from "@/routes/tour";

export const Route = createFileRoute("/admissions/tour")({
  validateSearch: admissionsSearch,
  head: () => ({
    meta: [
      { title: "Book a Campus Tour | Ekaaya International School Vadodara" },
      {
        name: "description",
        content:
          "Walk the open campus and meet our founding educators. Pick a date and slot for your Ekaaya campus tour on Sokhdakhurd, 30 mtr. Bill Sokhda Road, near Dadapura crossing, Vadodara. Chat with admissions or book a visit.",
      },
      { property: "og:title", content: "Book a Campus Tour | Ekaaya International School" },
      { property: "og:description", content: "Pick a date and slot to walk the campus and meet our founding educators. Pre-K to Grade 4." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TourChatPage,
});

function TourChatPage() {
  return (
    <TourPage>
      <AdmissionsChat />
    </TourPage>
  );
}
