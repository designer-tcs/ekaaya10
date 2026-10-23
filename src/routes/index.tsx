import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useLeadSubmit } from "@/components/ekaaya";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ADMISSION_CLASSES } from "@/lib/simply-admission";
import logoSrc from "@/assets/logo.png";
const logo = { url: logoSrc };
import heroSrc from "@/assets/hero-home.jpg";
const hero = { url: heroSrc };
import competentSrc from "@/assets/competent2.jpg";
const competent = { url: competentSrc };
import compassionateSrc from "@/assets/compassionate.jpg";
const compassionate = { url: compassionateSrc };
import consciousSrc from "@/assets/conscious2.jpg";
const conscious = { url: consciousSrc };
import artsSrc from "@/assets/life-arts.jpg";
const arts = { url: artsSrc };
import sportsSrc from "@/assets/life-sports.jpg";
const sports = { url: sportsSrc };
import wellbeingSrc from "@/assets/life-wellbeing.jpg";
const wellbeing = { url: wellbeingSrc };
import outdoorSrc from "@/assets/life-outdoor-learning.jpg";
const outdoor = { url: outdoorSrc };
import agencySrc from "@/assets/life-student-agency.jpg";
const agency = { url: agencySrc };
import wayTreeSrc from "@/assets/way/way-tree.webp";
const wayTree = { url: wayTreeSrc };
import wayHandsSrc from "@/assets/way/way-hands.webp";
const wayHands = { url: wayHandsSrc };
import wayStageSrc from "@/assets/way/way-stage.webp";
const wayStage = { url: wayStageSrc };
import voiceFounderSrc from "@/assets/voices/voice-founder.jpg";
const voiceFounder = { url: voiceFounderSrc };
import voiceHeadSrc from "@/assets/voices/voice-school-head.jpg";
const voiceHead = { url: voiceHeadSrc };
import voicePrimarySrc from "@/assets/voices/voice-primary-coordinator.jpg";
const voicePrimary = { url: voicePrimarySrc };
import voiceSportsSrc from "@/assets/voices/voice-sports-coordinator.jpg";
const voiceSports = { url: voiceSportsSrc };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ekaaya International School Vadodara | Admissions Open Pre-K to Grade 4" },
      {
        name: "description",
        content:
          "Let them be. Let them become. Admissions open at Ekaaya International School, Sokhdakhurd, 30 mtr. Bill Sokhda Road, near Dadapura crossing, Vadodara for Pre-K to Grade 4. Book a campus visit.",
      },
      { property: "og:title", content: "Ekaaya International School | Admissions Open" },
      { property: "og:description", content: "A place to become: competent, compassionate, conscious. Pre-K to Grade 4, Vadodara." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PHONE = "+91 8866352292";
const TEL = "tel:+918866352292";
const EMAIL = "info@ekaaya.education";
const WA = "https://wa.me/918866352292?text=" + encodeURIComponent("Hi Ekaaya, I'd like to know about admissions.");
const MAP = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Ekaaya International School, Sokhdakhurd, 30 mtr. Bill Sokhda Road, near Dadapura crossing, Vadodara");

type Kind = "enquiry" | "visit";
const input = "w-full rounded-lg border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function LeadForm({ kind, cta, wide, section }: { kind: Kind; cta: string; wide?: boolean; section: string }) {
  const [mode, setMode] = useState<Kind>(kind);
  const lead = useLeadSubmit(
    () => mode,
    "home",
    () => (mode === "enquiry" ? "Quick Enquiry" : wide ? "Book My Visit" : "Book a Tour"),
    section,
    () => (mode === "enquiry" ? "Quick Enquiry" : wide ? "Book a Campus Visit" : "Book a Campus Tour"),
  );
  const state = lead.state;
  const submit = (e: FormEvent<HTMLFormElement>) => lead.submit(e, (f) => (f.get("when") as string) || null);
  const grid = wide ? "grid gap-3 sm:grid-cols-2" : "grid gap-3";
  return (
    <form onSubmit={submit} className={grid}>
      {!wide && (
        <div className="grid grid-cols-2 rounded-lg bg-muted p-1 text-sm font-medium">
          {(["enquiry", "visit"] as Kind[]).map((k) => (
            <button type="button" key={k} onClick={() => setMode(k)}
              className={`rounded-md py-2 transition ${mode === k ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              {k === "enquiry" ? "Quick Enquiry" : "Book a Tour"}
            </button>
          ))}
        </div>
      )}
      <input name="name" required maxLength={100} placeholder="Parent's name" className={input} />
      <input name="phone" required type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" className={input} />
      {wide && <input name="email" type="email" maxLength={255} placeholder="Email (optional)" className={input} />}
      <select name="grade" required defaultValue="" className={input}>
        <option value="" disabled>Admission for</option>
        {ADMISSION_CLASSES.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>
      {mode === "visit" && (
        <select name="when" defaultValue="Weekday morning" className={input}>
          <option>Weekday morning</option>
          <option>Weekday afternoon</option>
          <option>Saturday</option>
        </select>
      )}
      <button disabled={state === "sending"}
        className={`rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60 ${wide ? "sm:col-span-2" : ""}`}>
        {state === "sending" ? "Sending…" : mode === "visit" && !wide ? "Book My Campus Tour" : cta}
      </button>
      {state === "error" && <p className={`text-xs text-destructive ${wide ? "sm:col-span-2" : ""}`}>{lead.message}</p>}
    </form>
  );
}

function Underline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 12" className={`mt-1 h-3 w-40 text-brand-gold ${className}`} fill="none" aria-hidden>
      <path d="M2 8 C 80 2, 160 12, 298 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Heading({ script, title, center }: { script: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "flex flex-col items-center text-center" : ""}>
      <p className="font-script text-3xl text-foreground/75">{script}</p>
      <h2 className="text-4xl font-bold text-brand-brown md:text-5xl">{title}</h2>
      <Underline />
    </div>
  );
}

const WAY = [
  {
    title: "The Ekaaya Curriculum",
    img: wayTree,
    alt: "A watercolour tree whose leaves are fingerprints, roots spreading below",
    text: "A balanced approach integrating academics, arts, sports and social-emotional learning.",
    tags: ["Academic Rigour", "Sports", "Arts", "SEL"],
  },
  {
    title: "The I-ACT Programme",
    img: wayHands,
    alt: "Cupped watercolour hands lifting a small fingerprint figure reaching toward a sprig",
    text: "Building initiative, enterprise and leadership skills from the early years through Grade 12.",
    tags: ["CARES", "Enterprise", "Democracy"],
  },
  {
    title: "Ekaaya Enrichment",
    img: wayStage,
    alt: "A watercolour open-air stage with bunting and small fingerprint children celebrating",
    text: "Beyond-classroom experiences that spark interests, develop life skills and nurture individual talents.",
    tags: ["Ekaaya Fest", "Ekaaya Spotlight", "Steam Program", "Life Lab", "Organic Farming"],
  },
];

const LIFE = [
  {
    title: "Outdoor Learning & Ecology",
    img: outdoor,
    span: "md:col-span-2 md:row-span-2",
    places: ["Amra Canopy", "Jan Path", "The Atelier", "Vyoma", "Marmar Woods", "Casita"],
  },
  { title: "Performing & Visual Arts", img: arts, text: "Art, pottery, music, dance and drama, indoors and out.", focus: "object-[center_28%] md:object-center" },
  { title: "Athletics & Physical Play", img: sports, text: "Kicking off, movement, sandpit and sports.", focus: "object-[center_22%] md:object-center" },
  { title: "Student Agency & Belonging", img: agency, text: "Democracy & Government, and an everyday rhythm children own.", focus: "object-[center_18%] md:object-center" },
  { title: "Wellbeing & Care", img: wellbeing, text: "Child-centred, a safe community and thoughtful nutrition." },
];

const VOICES = [
  { pill: "Our Founder and co-founder", who: "Our Founder and co-founder", name: "Viral Patel & Hiral Patel", designation: "Our Founder and co-founder", img: voiceFounder, quote: "We started Ekaaya because every child deserves a school that makes room for who they are, not one that asks them to fit in. We are building today for what comes next." },
  { pill: "Our School Head", who: "From the School Head", name: "Aneeka Kothari", designation: "Our School Head", img: voiceHead, quote: "Every child holds a world of possibilities and a unique potential to grow. As educators, our greatest privilege is to nurture curiosity, build confidence and character, and empower children to discover who they can become." },
  { pill: "Primary coordinator", who: "From the Primary Coordinator", name: "Primary coordinator", img: voicePrimary, quote: "We believe every child is curious and capable. We nurture joyful, meaningful learning beyond textbooks, building confidence, values and life skills to help children become independent, compassionate and responsible lifelong learners." },
  { pill: "Sports coordinator", who: "From the Sports Coordinator", name: "Sports coordinator", img: voiceSports, quote: "Believe in yourself, embrace challenges, and always give your best! Sports build character, discipline, and teamwork while helping you discover your inner strength. Remember, every champion starts with the courage to try!", aside: "“A champion is someone who gets up when they can’t.”\n— Jack Dempsey" },
];

function Index() {
  const [voice, setVoice] = useState(0);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const v = VOICES[voice] ?? VOICES[0]!;
  return (
    <main className="overflow-x-hidden bg-background pb-14 text-foreground sm:pb-0">
      {/* 1. Top bar + header */}
      <div className="hidden bg-foreground text-xs text-background sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2">
          <span>Admissions Now Open · Pre-K to Grade 4 · Vadodara</span>
          <div className="flex gap-5">
            <a href={TEL} className="hover:underline">{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="hover:underline">{EMAIL}</a>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <img src={logo.url} alt="Ekaaya International School" className="h-11 w-auto" />
          <nav className="hidden gap-6 text-sm font-medium lg:flex">
            <a href="#philosophy">Philosophy</a><a href="#life">Life at Ekaaya</a><a href="#pedagogy">Stages</a><a href="#voices">Voices</a><a href="#visit">Visit</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href={WA} target="_blank" rel="noreferrer" className="hidden rounded-lg border border-brand-green px-4 py-2 text-sm font-semibold text-brand-green sm:block">WhatsApp</a>
            <button type="button" onClick={() => setEnquireOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Enquire Now</button>
          </div>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="relative">
        <img src={hero.url} alt="A child drawing her future as an astronaut on a white wall" className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <span className="inline-block rounded-md bg-primary px-3 py-1 font-serif text-sm text-primary-foreground">Admissions Now Open · Pre-K to Grade 4</span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">A living learning ecosystem</p>
            <p className="mt-2 font-script text-3xl text-foreground/80">Let Them Be.</p>
            <h1 className="text-5xl font-bold leading-[1.05] text-brand-brown md:text-7xl">Let Them<br />Become.</h1>
            <Underline className="w-56" />
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Built today, for what comes next. Learning that makes room for individuality, on Sokhdakhurd, 30 mtr. Bill Sokhda Road, near Dadapura crossing, Vadodara.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {["Competent.", "Compassionate.", "Conscious."].map((t, i) => (
                <span key={t} className={`px-3 py-1 font-medium text-primary-foreground ${["bg-brand-brown", "bg-brand-green", "bg-brand-sky"][i]}`}>{t}</span>
              ))}
            </div>
          </div>
          <div id="enquire" className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-xl">
            <p className="font-script text-2xl text-brand-green">Start the conversation</p>
            <p className="mb-4 font-serif text-xl font-semibold">Enquire or book a campus tour</p>
            <LeadForm kind="enquiry" cta="Request a Callback" section="Home Hero" />
          </div>
        </div>
      </section>

      {/* 3. Philosophy */}
      <section id="philosophy" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <div>
          <Heading script="Our Philosophy" title="A Place to Become." />
          <p className="mt-4 max-w-2xl text-muted-foreground">Every child grows differently. Ekaaya gives each one room to grow in their own way, nurturing three dimensions of a whole learner.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { img: competent, label: "Competent.", tone: "bg-brand-brown", text: "Building knowledge, skills and confidence to think independently and take on new challenges." },
            { img: compassionate, label: "Compassionate.", tone: "bg-brand-green", text: "Growing with kindness, empathy and respect for others, and learning to care for one another." },
            { img: conscious, label: "Conscious.", tone: "bg-brand-sky", text: "Understanding themselves, appreciating the world around them and making thoughtful, responsible choices." },
          ].map((p) => (
            <figure key={p.label} className="group">
              <div className="overflow-hidden rounded-b-[999px] rounded-t-xl">
                <img src={p.img.url} alt={p.label} loading="lazy" className="aspect-[3/4] w-full object-cover object-[center_72%] transition duration-500 group-hover:scale-105" />
              </div>
              <figcaption className="mt-4 text-center">
                <span className={`inline-block px-3 py-1 text-sm font-medium text-primary-foreground ${p.tone}`}>{p.label}</span>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 4. Life at Ekaaya */}
      <section id="life" className="scroll-mt-20 bg-card/60 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Heading script="Where childhood has room to unfold." title="Life at Ekaaya." />
            <a href="#visit" className="rounded-lg border border-foreground px-5 py-2.5 text-sm font-semibold hover:bg-foreground hover:text-background">See it in person →</a>
          </div>
          <div className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-4">
            {LIFE.map((l) => (
              <figure key={l.title} className={`group relative overflow-hidden rounded-2xl ${l.span ?? "md:col-span-2 lg:col-span-1"}`}>
                <img src={l.img.url} alt={l.title} loading="lazy" className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${l.focus ?? "object-center"}`} />
                <figcaption className="absolute inset-x-3 bottom-3">
                  <div className="rounded-lg bg-brand-brown/80 px-3 py-2 text-background shadow-sm backdrop-blur-sm">
                    <p className="font-serif text-lg font-semibold leading-tight">{l.title}</p>
                    {l.places ? (
                      <p className="mt-1 text-xs leading-snug text-background/90">
                        Amra Canopy, The Atelier, Marmar Woods, Jan Path, Vyoma, Casita.
                      </p>
                    ) : (
                      <p className="mt-1 text-xs leading-snug text-background/90">{l.text}</p>
                    )}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* The Ekaaya way */}
      <section id="pedagogy" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <Heading script="Three Pillars. One Purpose." title="The Ekaaya Way" center />
        <div className="mt-10 grid items-stretch gap-6 md:grid-cols-3">
          {WAY.map((p) => (
            <article key={p.title} className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative m-3 mb-0 aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                <img src={p.img.url} alt={p.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="min-h-16 text-2xl font-semibold leading-tight">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.text}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Voices */}
      <section id="voices" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <Heading script="From the desk of" title="Our Leaders & Team." center />
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">Ekaaya opens its doors this year. Hear from the people who are building it for your child.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {VOICES.map((x, i) => (
            <button key={x.pill} onClick={() => setVoice(i)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${voice === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {x.pill}
            </button>
          ))}
        </div>
        <div key={voice} className="mt-8 grid items-center gap-8 rounded-3xl bg-brand-sand p-6 animate-in fade-in md:grid-cols-[1fr_1.4fr] md:p-10">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-muted shadow-md ring-4 ring-background">
            <img src={v.img.url} alt={v.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
          </div>
          <blockquote>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-green">{v.who}</span>
            <p className="mt-3 font-serif text-2xl italic leading-snug md:text-3xl">“{v.quote}”</p>
            {v.aside && <p className="mt-4 whitespace-pre-line font-serif text-xl italic leading-snug md:text-2xl">{v.aside}</p>}
            <footer className="mt-4 font-script text-2xl text-brand-brown">{v.name}</footer>
            {"designation" in v && v.designation && <p className="mt-1 text-sm font-medium text-brand-brown">{v.designation}</p>}
          </blockquote>
        </div>
      </section>

      {/* 8. Visit */}
      <section id="visit" className="scroll-mt-20 bg-foreground py-16 text-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-script text-3xl text-brand-gold">Where the city ends,</p>
            <h2 className="text-4xl font-bold md:text-5xl">the campus begins.</h2>
            <p className="mt-3 font-serif text-lg italic text-background/80">A Place to Become: Competent, Compassionate, Conscious.</p>
            <div className="mt-8 space-y-4 text-sm">
              <div>
                <p className="font-serif text-lg text-brand-gold">Campus</p>
                <p className="text-background/80">Sokhdakhurd, 30 mtr. Bill Sokhda Road, near Dadapura crossing, Vadodara</p>
                <a href={MAP} target="_blank" rel="noreferrer" className="mt-1 inline-block font-medium underline">Open in Google Maps →</a>
              </div>
              <div>
                <p className="font-serif text-lg text-brand-gold">Contact</p>
                <a href={TEL} className="block text-background/80">{PHONE}</a>
                <a href={`mailto:${EMAIL}`} className="block text-background/80">{EMAIL}</a>
                <a href="https://www.ekaaya.education/" className="block text-background/80">www.ekaaya.education</a>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-background p-6 text-foreground md:p-8">
            <span className="inline-block rounded-md bg-primary px-3 py-1 font-serif text-sm text-primary-foreground">Built Today. For What Comes Next.</span>
            <h3 className="mt-3 text-2xl font-semibold">Book a Campus Visit</h3>
            <p className="mb-4 text-sm text-muted-foreground">Walk the campus, meet our educators and ask anything.</p>
            <LeadForm kind="visit" cta="Book My Visit" wide section="Campus Visit" />
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-6xl px-5 text-xs text-background/50">© Ekaaya International School, Vadodara</p>
      </section>

      {/* 9. Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-background text-sm font-semibold sm:hidden">
        <a href={TEL} className="py-3.5 text-center">Call</a>
        <a href={WA} target="_blank" rel="noreferrer" className="border-x border-border py-3.5 text-center text-brand-green">WhatsApp</a>
        <button type="button" onClick={() => setEnquireOpen(true)} className="bg-primary py-3.5 text-center text-primary-foreground">Enquire</button>
      </div>

      <Dialog open={enquireOpen} onOpenChange={setEnquireOpen}>
        <DialogContent className="max-h-[min(90vh,40rem)] overflow-y-auto rounded-2xl border-border bg-card p-6 shadow-xl sm:max-w-md">
          <DialogHeader className="space-y-1 pr-6 text-left">
            <p className="font-script text-2xl text-brand-green">Start the conversation</p>
            <DialogTitle className="font-serif text-xl font-semibold">Enquire or book a campus tour</DialogTitle>
            <DialogDescription className="sr-only">
              Parent name, mobile number, and the class you are enquiring for.
            </DialogDescription>
          </DialogHeader>
          <LeadForm kind="enquiry" cta="Request a Callback" section="Enquire Now" />
        </DialogContent>
      </Dialog>
    </main>
  );
}
