import { Link, createFileRoute } from "@tanstack/react-router";
import { ADDRESS, MAP, PHONE, SiteFooter, TEL, Underline, wa } from "@/components/ekaaya";
import logoSrc from "@/assets/logo.png";
const logo = { url: logoSrc };

export const Route = createFileRoute("/thank-you")({
  validateSearch: (s: Record<string, unknown>): { type?: string | undefined } => ({ type: typeof s["type"] === "string" ? (s["type"] as string) : undefined }),
  head: () => ({
    meta: [
      { title: "Thank You | Ekaaya International School" },
      { name: "description", content: "We've received your details. Our admissions team will call you within 4 hours." },
      { property: "og:title", content: "Thank You | Ekaaya International School" },
      { property: "og:description", content: "Our admissions team will be in touch shortly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

const COPY: Record<string, string> = {
  tour: "Your campus tour request is in. We'll call to confirm your day and slot.",
  visit: "Your campus visit request is in. We'll call to confirm a time.",
  "early-years-session": "Your Early Years discovery session request is in.",
  handbook: "The Early Childhood Parent Handbook is on its way to you.",
};

function ThankYou() {
  const { type } = Route.useSearch();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-12 text-center">
        <Link to="/"><img src={logo.url} alt="Ekaaya International School" className="mx-auto h-14 w-auto mix-blend-multiply" /></Link>
        <p className="mt-10 font-script text-4xl text-brand-green">Thank you!</p>
        <h1 className="text-4xl font-bold text-brand-brown md:text-5xl">We'll call you within 4 hours.</h1>
        <Underline className="mx-auto w-56" />
        <p className="mt-4 text-muted-foreground">{(type && COPY[type]) || "We've received your details."} Calls are made between 9 AM and 6 PM, Monday to Saturday.</p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={wa("Hi Ekaaya, I just submitted a form and have a quick question.")} target="_blank" rel="noreferrer" className="rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-primary-foreground">WhatsApp us now · {PHONE}</a>
          <a href={wa("Hi Ekaaya, please send me the digital prospectus.")} target="_blank" rel="noreferrer" className="rounded-lg border border-brand-brown px-6 py-3 text-sm font-semibold text-brand-brown">Get the Digital Prospectus</a>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-left">
          <p className="font-script text-2xl text-brand-green">Find us</p>
          <p className="font-serif text-lg font-semibold">Ekaaya International School</p>
          <p className="text-sm text-muted-foreground">{ADDRESS}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <a href={MAP} target="_blank" rel="noreferrer" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Directions on Google Maps</a>
            <a href={TEL} className="rounded-lg border border-input px-4 py-2">Call {PHONE}</a>
          </div>
        </div>
        <Link to="/" className="mt-8 inline-block text-sm text-muted-foreground underline">Back to the main page</Link>
      </div>
      <SiteFooter />
    </main>
  );
}
