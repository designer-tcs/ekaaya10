import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoSrc from "@/assets/logo.png";
const logo = { url: logoSrc };

export const PHONE = "+91 88663 52292";
export const TEL = "tel:+918866352292";
export const EMAIL = "info@ekaaya.education";
export const wa = (msg: string) => "https://wa.me/918866352292?text=" + encodeURIComponent(msg);
export const WA = wa("Hi Ekaaya, I'd like to know about admissions.");
export const ADDRESS = "Bill Sokhda Road, Sokhdakhurd, near Dadapura crossing, Vadodara";
export const MAP =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Ekaaya International School, Sokhdakhurd, Bill Road, near Dadapura crossing, Vadodara");
export const inputCls =
  "w-full rounded-lg border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export function Underline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 12" className={`mt-1 h-3 w-40 text-brand-gold ${className}`} fill="none" aria-hidden>
      <path d="M2 8 C 80 2, 160 12, 298 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Heading({ script, title, center }: { script: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "flex flex-col items-center text-center" : ""}>
      <p className="font-script text-3xl text-foreground/75">{script}</p>
      <h2 className="text-4xl font-bold text-brand-brown md:text-5xl">{title}</h2>
      <Underline />
    </div>
  );
}

export function SiteHeader({ cta = "Book a Tour", href = "#book" }: { cta?: string; href?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/"><img src={logo.url} alt="Ekaaya International School" className="h-11 w-auto mix-blend-multiply" /></Link>
        <div className="flex items-center gap-2">
          <a href={TEL} className="hidden text-sm font-medium sm:block">{PHONE}</a>
          <a href={WA} target="_blank" rel="noreferrer" className="hidden rounded-lg border border-brand-green px-4 py-2 text-sm font-semibold text-brand-green sm:block">WhatsApp</a>
          <a href={href} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{cta}</a>
        </div>
      </div>
    </header>
  );
}

export function MobileBar({ href = "#book", label = "Book" }: { href?: string; label?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-card text-center text-sm font-semibold sm:hidden">
      <a href={TEL} className="py-3">Call</a>
      <a href={WA} target="_blank" rel="noreferrer" className="bg-brand-green py-3 text-primary-foreground">WhatsApp</a>
      <a href={href} className="bg-brand-brown py-3 text-primary-foreground">{label}</a>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
      Ekaaya International School · {ADDRESS} · <a href={TEL}>{PHONE}</a> · <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
    </footer>
  );
}

/** Saves a lead to the enquiries table, then sends the visitor to /thank-you. */
export function useLeadSubmit(kind: string | (() => string), source: string) {
  const navigate = useNavigate();
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  async function submit(e: FormEvent<HTMLFormElement>, extra?: (f: FormData) => string | null) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const phone = String(f.get("phone") || "").trim();
    if (!/^[+\d\s-]{7,20}$/.test(phone)) return setState("error");
    setState("sending");
    const email = String(f.get("email") || "").trim();
    const k = typeof kind === "function" ? kind() : kind;
    const { error } = await supabase.from("enquiries").insert({
      kind: k,
      parent_name: String(f.get("name") || "").trim().slice(0, 100),
      phone,
      email: email || null,
      child_grade: (f.get("grade") as string) || null,
      message: [`source: ${source}`, extra?.(f)].filter(Boolean).join(" · ").slice(0, 1000),
    });
    if (error) return setState("error");
    navigate({ to: "/thank-you", search: { type: k } });
  }
  return { state, submit };
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card p-6 shadow-xl ${className}`}>{children}</div>;
}

export function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map(([q, a], i) => (
        <div key={q}>
          <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-serif text-lg font-semibold">
            {q}<span className="text-brand-green">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p className="px-5 pb-5 text-sm text-muted-foreground">{a}</p>}
        </div>
      ))}
    </div>
  );
}

export function Steps({ items }: { items: [string, string, string][] }) {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-4">
      {items.map(([tag, t, d], i) => (
        <div key={t} className="relative rounded-2xl border border-border bg-card p-5">
          <span className="font-script text-4xl text-brand-gold">{i + 1}</span>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">{tag}</p>
          <p className="mt-1 font-serif text-lg font-semibold">{t}</p>
          <p className="mt-1 text-sm text-muted-foreground">{d}</p>
        </div>
      ))}
    </div>
  );
}
