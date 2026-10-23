import { createFileRoute } from "@tanstack/react-router";
import compassionateSrc from "@/assets/early-years/early-years-hero.jpg";
const compassionate = { url: compassionateSrc };
import artsSrc from "@/assets/early-years/early-years-play-based-inquiry.jpg";
const arts = { url: artsSrc };
import wellbeingSrc from "@/assets/early-years/early-years-emotional-wellbeing.jpg";
const wellbeing = { url: wellbeingSrc };
import sportsSrc from "@/assets/early-years/early-years-caretaker-attention.jpg";
const sports = { url: sportsSrc };
import { Card, Heading, MobileBar, SiteFooter, SiteHeader, Underline, inputCls, useLeadSubmit } from "@/components/ekaaya";
import { EARLY_YEARS_CLASSES } from "@/lib/simply-admission";

export const Route = createFileRoute("/early-years")({
  head: () => ({
    meta: [
      { title: "Early Years (Ages 3–6) | Ekaaya International School Vadodara" },
      { name: "description", content: "Play-based inquiry under the Amra canopy, a gentle home-to-school transition and dedicated caretaker attention for toddlers, nursery and kindergarten." },
      { property: "og:title", content: "Early Years at Ekaaya | Ages 3 to 6" },
      { property: "og:description", content: "Book an Early Years discovery session." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EarlyYears,
});

function EYForm() {
  const { state, message, submit } = useLeadSubmit("early-years-session", "early-years-page", "Book a Tour", "Early Years", "Book a Discovery Session");
  return (
    <form onSubmit={(e) => submit(e)} className="grid gap-3">
      <input name="name" required maxLength={100} placeholder="Parent's name" className={inputCls} />
      <input name="phone" required type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" className={inputCls} />
      <input name="email" type="email" maxLength={255} placeholder="Email (optional)" className={inputCls} />
      <select name="grade" required defaultValue="" className={inputCls}>
        <option value="" disabled>Child's class</option>
        {EARLY_YEARS_CLASSES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
      </select>
      <button disabled={state === "sending"} className="rounded-lg bg-brand-brown px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Book a Discovery Session"}
      </button>
      {state === "error" && <p className="text-xs text-destructive">{message}</p>}
    </form>
  );
}

const PILLARS = [
  { img: wellbeing.url, t: "Emotional Wellbeing", d: "Every child feels heard, understood and supported in a caring environment." },
  { img: arts.url, t: "Learning Through Play", d: "Hands-on experiences that turn everyday discoveries into meaningful learning." },
  { img: sports.url, t: "Attentive Care, Every Day", d: "Dedicated caretakers ensure children feel safe, comfortable and cared for throughout the day." },
];

function EarlyYears() {
  return (
    <main className="overflow-x-hidden bg-background pb-14 text-foreground sm:pb-0">
      <SiteHeader cta="Book a Session" />
      <section className="relative">
        <img src={compassionate.url} alt="Young children learning together" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1.1fr_1fr] md:py-16">
          <div>
            <span className="inline-block rounded-md bg-brand-green px-3 py-1 font-serif text-sm text-primary-foreground">Early Years · Ages 3 to 6</span>
            <p className="mt-6 font-script text-3xl text-foreground/80">Every child grows differently.</p>
            <h1 className="text-5xl font-bold leading-[1.05] text-brand-brown md:text-6xl">Small steps.<br />Safe hands.</h1>
            <Underline className="w-56" />
            <p className="mt-5 max-w-md text-lg text-muted-foreground">From toddlers to nursery and kindergarten — we offer a world of play and imagination, where every child is free to explore and grow.</p>
          </div>
          <Card>
            <div id="book" className="scroll-mt-24" />
            <p className="font-script text-2xl text-brand-green">For your little one's first big steps</p>
            <p className="mb-4 font-serif text-xl font-semibold">Let's Begin Their Ekaaya Journey</p>
            <EYForm />
          </Card>
        </div>
      </section>

      <section className="bg-muted/60 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <Heading script="How we care" title="Let Them Be." center />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.t} className="rounded-2xl border border-border bg-card p-3">
                <img src={p.img} alt={p.t} className="aspect-square w-full rounded-xl object-cover object-[center_30%]" loading="lazy" />
                <p className="mt-4 px-1 font-serif text-lg font-semibold leading-snug">{p.t}</p>
                <p className="px-1 pb-2 text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day in the life */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Heading script="A gentle rhythm" title="A day in the Early Years." center />
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">Every day is filled with opportunities to play, explore, create, and discover.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {["Familiar routines", "Stories, music, and movement", "Outdoor play", "Hands-on learning centres"].map((beat) => (
            <div key={beat} className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="font-serif text-lg font-semibold leading-snug">{beat}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">Through play and independent choices, children build early literacy and numeracy, confidence, independence, and social-emotional understanding.</p>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 text-center">
        <p className="font-script text-3xl text-brand-green">"The measure of a great school is not how quickly it shapes children, but how patiently it allows them to become."</p>
        <a href="#book" className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground">Book an Early Years Discovery Session</a>
      </section>
      <SiteFooter />
      <MobileBar label="Book" />
    </main>
  );
}
