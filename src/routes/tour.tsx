import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import heroSrc from "@/assets/hero-clean.jpg";
const hero = { url: heroSrc };
import competentSrc from "@/assets/tour/tour-open-learning-courtyards.jpg";
const competent = { url: competentSrc };
import compassionateSrc from "@/assets/tour/tour-outdoor-learning.jpg";
const compassionate = { url: compassionateSrc };
import consciousSrc from "@/assets/tour/tour-founding-educators.jpg";
const conscious = { url: consciousSrc };
import foundersSrc from "@/assets/tour/tour-founders.jpg";
const founders = { url: foundersSrc };
import { ADDRESS, Card, Heading, MAP, MobileBar, PHONE, SiteFooter, SiteHeader, TEL, Underline, inputCls, useLeadSubmit } from "@/components/ekaaya";

export const Route = createFileRoute("/tour")({
  head: () => ({
    meta: [
      { title: "Book a Campus Tour | Ekaaya International School Vadodara" },
      { name: "description", content: "Walk the open campus and meet our founding educators. Pick a date and slot for your Ekaaya campus tour on Bill Sokhda Road, Vadodara." },
      { property: "og:title", content: "Book a Campus Tour | Ekaaya International School" },
      { property: "og:description", content: "Pick a date and slot to walk the campus and meet our founding educators. Pre-K to Grade 4." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TourPage,
});

const GRADES = ["Nursery", "Jr.KG", "Sr.KG", "Grade 1", "Grade 2", "Grade 3", "Grade 4"];
const SLOTS = ["9:30 – 10:30 AM", "11:00 AM – 12:00 PM", "3:00 – 4:00 PM"];

function nextDays() {
  const out: { value: string; label: string }[] = [];
  const d = new Date();
  while (out.length < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue;
    out.push({
      value: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
    });
  }
  return out;
}

function TourForm() {
  const days = useMemo(nextDays, []);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const { state, submit } = useLeadSubmit("tour", "tour-page");
  const chip = (on: boolean) => `rounded-lg border px-2 py-2 text-xs font-medium transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card"}`;
  return (
    <form onSubmit={(e) => submit(e, () => `tour: ${day ?? "any day"} ${slot ?? "any slot"}`)} className="grid gap-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1. Pick a day</p>
      <div className="grid grid-cols-3 gap-2" suppressHydrationWarning>
        {days.map((d) => (
          <button type="button" key={d.value} onClick={() => setDay(d.value)} className={chip(day === d.value)} suppressHydrationWarning>{d.label}</button>
        ))}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">2. Pick a slot</p>
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map((s) => <button type="button" key={s} onClick={() => setSlot(s)} className={chip(slot === s)}>{s}</button>)}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">3. Your details</p>
      <input name="name" required maxLength={100} placeholder="Parent's name" className={inputCls} />
      <input name="phone" required type="tel" placeholder="Mobile number" className={inputCls} />
      <select name="grade" required defaultValue="" className={inputCls}>
        <option value="" disabled>Admission for</option>
        {GRADES.map((g) => <option key={g}>{g}</option>)}
      </select>
      <button disabled={state === "sending" || !day || !slot} className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
        {state === "sending" ? "Booking…" : !day || !slot ? "Pick a day & slot" : "Confirm My Campus Tour"}
      </button>
      {state === "error" && <p className="text-xs text-destructive">Please check your details and try again.</p>}
      <p className="text-center text-xs text-muted-foreground">Free · 40 minutes · We'll confirm by call</p>
    </form>
  );
}

const HIGHLIGHTS = [
  { img: competent.url, t: "Open learning courtyards", d: "Classrooms that open into green, light-filled spaces." },
  { img: compassionate.url, t: "Outdoor learning", d: "Nature, stories and play, beyond the classroom walls." },
  { img: conscious.url, t: "Meet the founding educators", d: "Sit with the people who will know your child by name." },
];

function TourPage() {
  return (
    <main className="overflow-x-hidden bg-background pb-14 text-foreground sm:pb-0">
      <SiteHeader cta="Book a Tour" />
      {/* Fold 1 */}
      <section className="relative">
        <img src={hero.url} alt="A child drawing her future on a white wall" className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1.1fr_1fr] md:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-semibold shadow-sm">📍 Bill Sokhda Road, Vadodara</span>
            <p className="mt-6 font-script text-3xl text-foreground/80">Come see it for yourself.</p>
            <h1 className="text-5xl font-bold leading-[1.05] text-brand-brown md:text-6xl">Walk the campus.<br />Meet the people.</h1>
            <Underline className="w-56" />
            <p className="mt-5 max-w-md text-lg text-muted-foreground">A 40-minute guided walkthrough of our open campus with the founding educators. Pre-K to Grade 4.</p>
            <div className="mt-6 grid max-w-md grid-cols-2 gap-3">
              {[["Pre-K–4", "admissions open"], ["40 min", "guided walk"]].map(([n, l]) => (
                <div key={l} className="rounded-xl bg-card/90 p-3 text-center shadow-sm">
                  <p className="font-serif text-xl font-bold text-brand-green">{n}</p>
                  <p className="text-[11px] leading-tight text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="scroll-mt-24" >
            <div id="book" className="scroll-mt-24" />
            <p className="font-script text-2xl text-brand-green">Reserve your visit</p>
            <p className="mb-4 font-serif text-xl font-semibold">Book a campus tour</p>
            <TourForm />
          </Card>
        </div>
      </section>

      {/* Fold 2 */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Heading script="What you'll see" title="A living learning ecosystem." center />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.t} className="rounded-2xl border border-border bg-card p-3">
              <img src={h.img} alt={h.t} className="aspect-[4/3] w-full rounded-xl object-cover object-[center_25%]" loading="lazy" />
              <p className="mt-4 px-2 font-serif text-xl font-semibold">{h.t}</p>
              <p className="px-2 pb-2 text-sm text-muted-foreground">{h.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Itinerary */}
      <section className="bg-muted/60 px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <Heading script="Your 40 minutes" title="How the tour unfolds." center />
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">We look forward to welcoming you to Ekaaya. Your visit is an opportunity to explore our campus, understand the thinking behind its design, and have an open conversation with our team.</p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">The guided campus tour takes approximately 40 minutes. The full visit also includes the welcome and a follow-up conversation.</p>
          <div className="mt-10 grid gap-4">
            {[
              ["A Warm Welcome", "Begin your visit with a welcome from our front office executive, followed by an introduction from our admissions counsellor."],
              ["Discover the Campus", "Take a 40-minute guided tour to understand our architectural vision, campus master plan, and planned indoor and outdoor environments."],
              ["Explore the Learning Spaces", "Step inside our model Early Years and Primary Years classrooms and visit our open courtyards and creative spaces, including the art studio."],
              ["Conversations Over Refreshments", "Return to our counselling room for refreshments, questions, and a discussion about Ekaaya. You may also meet the Head of School or a founder, subject to availability."],
              ["Until We Meet Again", "Before you leave, our admissions team will be happy to explain the next steps and assist with any further enquiries."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-serif text-lg font-semibold">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
        <img src={founders.url} alt="Children exploring at Ekaaya" className="aspect-[4/3] w-full rounded-2xl border-4 border-card object-cover object-[center_25%] shadow-md" loading="lazy" />
        <div>
          <Heading script="From the founding team" title="Built Today. For What Comes Next." />
          <p className="mt-5 font-serif text-xl italic text-foreground/85">"This is our first year, so every family who walks in helps shape what Ekaaya becomes. Come meet us before you decide anything."</p>
          <p className="mt-3 text-sm text-muted-foreground">— Founder, Ekaaya International School</p>
          <a href="#book" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Pick My Tour Slot</a>
        </div>
      </section>

      {/* Fold 3 */}
      <section className="bg-brand-green px-5 py-14 text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <p className="font-script text-3xl">Where the city ends, the campus begins.</p>
          <p className="text-sm opacity-90">{ADDRESS}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#book" className="rounded-lg bg-card px-6 py-3 text-sm font-semibold text-foreground">Book My Tour</a>
            <a href={MAP} target="_blank" rel="noreferrer" className="rounded-lg border border-primary-foreground px-6 py-3 text-sm font-semibold">Get Directions</a>
            <a href={TEL} className="rounded-lg border border-primary-foreground px-6 py-3 text-sm font-semibold">Call {PHONE}</a>
          </div>
        </div>
      </section>
      <SiteFooter />
      <MobileBar label="Book Tour" />
    </main>
  );
}
