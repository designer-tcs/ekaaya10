import { createFileRoute, redirect } from "@tanstack/react-router";
import { admissionsSearch } from "@/routes/admissions";

export const Route = createFileRoute("/admissions/")({
  validateSearch: admissionsSearch,
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/campus-vist", search, statusCode: 301 });
  },
});
