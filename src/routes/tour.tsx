import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
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
import { AdmissionsChat } from "@/components/admissions-chat";
import { ADDRESS, Card, Heading, MAP, MobileBar, PHONE, SiteFooter, SiteHeader, TEL, Underline, inputCls, useLeadSubmit } from "@/components/ekaaya";
import { ADMISSION_CLASSES } from "@/lib/simply-admission";

export const Route = createFileRoute("/tour")({
  head: () => ({
    meta: [
      { title: "Book a Campus Tour | Ekaaya International School Vadodara" },
      { name: "description", content: "Walk the open campus and meet our founding educators. Pick a date and slot for your Ekaaya campus tour on Sokhdakhurd, 30 mtr. Bill Sokhda Road, near Dadapura crossing, Vadodara." },
      { property: "og:title", content: "Book a Campus Tour | Ekaaya International School" },
      { property: "og:description", content: "Pick a date and slot to walk the campus and meet our founding educators. Pre-K to Grade 4." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tour,
});

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
  const { state, message, submit } = useLeadSubmit("tour", "tour-page", "Book a Tour", "Campus Tour", "Book a Campus Tour");
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
      <input name="phone" required type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" className={inputCls} />
      <select name="grade" required defaultValue="" className={inputCls}>
        <option value="" disabled>Admission for</option>
        {ADMISSION_CLASSES.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>
      <button disabled={state === "sending" || !day || !slot} className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
        {state === "sending" ? "Booking…" : !day || !slot ? "Pick a day & slot" : "Confirm My Campus Tour"}
      </button>
      {state === "error" && <p className="text-xs text-destructive">{message}</p>}
      <p className="text-center text-xs text-muted-foreground">Free · 40 minutes · We'll confirm by call</p>
    </form>
  );
}

const HIGHLIGHTS = [
  { img: competent.url, t: "Learning Beyond Four Walls", d: "Bright, open classrooms that extend into green courtyards, creating space for exploration and interaction." },
  { img: compassionate.url, t: "Nature as a Classroom", d: "From observing nature to asking questions, the outdoors becomes part of everyday learning." },
  { img: conscious.url, t: "Meet the Core Team", d: "Get to know the people who bring Ekaaya's vision to life and understand their approach to education." },
];

export function TourPage({ children }: { children?: ReactNode }) {
  return (
    <main className="overflow-x-hidden bg-background pb-14 text-foreground sm:pb-0">
      <SiteHeader cta="Book a Tour" />
      {/* Fold 1 */}
      <section className="relative">
        <img src={hero.url} alt="A child drawing her future on a white wall" className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1.1fr_1fr] md:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-semibold shadow-sm">📍 Sokhdakhurd, 30 mtr. Bill Sokhda Road, near Dadapura crossing, Vadodara</span>
            <p className="mt-6 font-script text-3xl text-foreground/80">Your first glimpse of Ekaaya.</p>
            <h1 className="text-5xl font-bold leading-[1.05] text-brand-brown md:text-6xl">Some places are better experienced.</h1>
            <Underline className="w-56" />
            <p className="mt-5 max-w-md text-lg text-muted-foreground">Explore our Campus, meet our Educators and discover what makes learning at Ekaaya different.</p>
            <div className="mt-6 grid max-w-md grid-cols-2 gap-3">
              {[["Discover Ekaaya", "Admissions Open"], ["40 Minutes", "Guided Experience"]].map(([n, l]) => (
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
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold text-brand-brown md:text-5xl">A Campus Designed for Discovery.</h2>
          <Underline />
        </div>
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
          <Heading script="A little time. A closer look." title="Experience Ekaaya for Yourself" center />
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">Step inside Ekaaya, explore the spaces where learning comes alive, discover the thought behind our campus and meet the team bringing it all together.</p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">Your visit includes a 40-minute guided campus tour, followed by an opportunity to ask questions, share your expectations and learn more about the Ekaaya experience.</p>
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
      {children ?? (
        <div className="sm:hidden">
          <AdmissionsChat />
        </div>
      )}
    </main>
  );
}

function Tour() {
  return <TourPage />;
}
