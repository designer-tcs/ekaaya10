import { MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { EMAIL, MAP, PHONE, TEL } from "@/components/ekaaya";
import { supabase } from "@/integrations/supabase/client";
import {
  STEPS,
  VISIT_SLOTS,
  chatLeadNote,
  choicesFor,
  openingTranscript,
  resolveIncoming,
  type FormSpec,
  type StepId,
  type TranscriptLine,
} from "@/lib/chat-flow";
import { ADMISSION_CLASSES, isEmail, mapClass, normalizeMobile, readUtm } from "@/lib/simply-admission";
import { submitEnquiry } from "@/lib/submit-enquiry";

type ChatMessage = TranscriptLine & { id: number; form?: FormSpec };

const field =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-ring";

function upcomingVisitDays() {
  const out: string[] = [];
  const day = new Date();
  day.setHours(12, 0, 0, 0);
  while (out.length < 8) {
    day.setDate(day.getDate() + 1);
    if (day.getDay() === 0) continue;
    out.push(day.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }));
  }
  return out;
}

function toMessage(line: TranscriptLine, id: number): ChatMessage {
  const form = line.stepId ? STEPS[line.stepId].form : undefined;
  return form ? { ...line, id, form } : { ...line, id };
}

function withoutForm(message: ChatMessage): ChatMessage {
  if (!message.form) return message;
  const { form: _form, ...rest } = message;
  return rest;
}

function ContactBody() {
  return (
    <div className="space-y-1">
      <p>We would be delighted to assist you.</p>
      <p>
        📞 <a href={TEL} className="underline">{PHONE}</a>
      </p>
      <p>
        ✉️ <a href={`mailto:${EMAIL}`} className="underline">{EMAIL}</a>
      </p>
      <p>
        📍{" "}
        <a href={MAP} target="_blank" rel="noreferrer" className="underline">
          Sokhdakhurd, Bill Sokhda Road, near Dadapura Crossing, Vadodara
        </a>
      </p>
      <p>
        🌐 <a href="https://www.ekaaya.education/" className="underline">www.ekaaya.education</a>
      </p>
    </div>
  );
}

function ChatLeadForm({
  spec,
  grades,
  gradeLabel,
  onSuccess,
}: {
  spec: FormSpec;
  grades: readonly { value: string; label: string }[];
  gradeLabel: string;
  onSuccess: () => void;
}) {
  const [days, setDays] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (spec.kind === "visit") setDays(upcomingVisitDays());
  }, [spec.kind]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim().slice(0, 100);
    const child = String(data.get("child") || "").trim().slice(0, 100);
    const email = String(data.get("email") || "").trim().slice(0, 255);
    const phone = normalizeMobile(String(data.get("phone") || ""));
    const grade = mapClass(String(data.get("grade") || ""));
    const when = String(data.get("when") || "").trim();
    const slot = String(data.get("slot") || "").trim();

    if (!name) return fail("Please enter the parent's full name.");
    if (child.length < 2) return fail("Please enter the child's name.");
    if (email && !isEmail(email)) return fail("Please enter a valid email address.");
    if (!grade) return fail("Please choose the grade seeking admission.");
    if (!phone) return fail("Please enter a 10-digit mobile number.");
    if (spec.kind === "visit" && !when) return fail("Please choose a preferred visit date.");
    if (spec.kind === "visit" && !VISIT_SLOTS.includes(slot as (typeof VISIT_SLOTS)[number])) {
      return fail("Please choose a preferred time slot.");
    }

    setState("sending");
    setMessage("");
    const note = chatLeadNote(spec, { child, email, when, slot });

    const backup = (async () => {
      try {
        const { error } = await supabase.from("enquiries").insert({
          kind: spec.kind === "visit" ? "visit" : "enquiry",
          parent_name: name,
          phone,
          email: email || null,
          child_grade: grade,
          message: note,
        });
        if (error) console.error(error);
      } catch (error) {
        console.error(error);
      }
    })();

    try {
      const crm = await submitEnquiry({
        data: {
          name,
          phone,
          email,
          grade,
          sourceName: spec.sourceName,
          sectionName: spec.sectionName,
          formName: spec.formName,
          note,
          utm: readUtm(),
        },
      });
      if (!crm.ok) return fail(crm.error);
      onSuccess();
    } catch (error) {
      console.error(error);
      fail("Please check your details and try again.");
    } finally {
      await backup;
    }
  }

  function fail(text: string) {
    setMessage(text);
    setState("error");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-2.5">
      <label className="grid gap-1 text-xs font-medium">
        Parent's Full Name
        <input name="name" required maxLength={100} autoComplete="name" className={field} />
      </label>
      <label className="grid gap-1 text-xs font-medium">
        Child's Name
        <input name="child" required maxLength={100} className={field} />
      </label>
      <label className="grid gap-1 text-xs font-medium">
        {gradeLabel}
        <select name="grade" required defaultValue="" className={field}>
          <option value="" disabled>{gradeLabel}</option>
          {grades.map((grade) => (
            <option key={grade.value} value={grade.value}>{grade.label}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium">
        Email Address <span className="font-normal text-muted-foreground">(optional)</span>
        <input name="email" type="email" maxLength={255} autoComplete="email" placeholder="Email address (optional)" className={field} />
      </label>
      <label className="grid gap-1 text-xs font-medium">
        Mobile Number
        <input name="phone" required type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" className={field} />
      </label>
      {spec.kind === "visit" && (
        <>
          <label className="grid gap-1 text-xs font-medium">
            Preferred Visit Date
            <select name="when" required defaultValue="" className={field}>
              <option value="" disabled>Preferred Visit Date</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-medium">
            Preferred Time Slot
            <select name="slot" required defaultValue="" className={field}>
              <option value="" disabled>Preferred Time Slot</option>
              {VISIT_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </label>
        </>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : spec.submitLabel}
      </button>
      {state === "error" && <p className="text-xs text-destructive">{message}</p>}
    </form>
  );
}

const ADMISSION_GRADE_CHOICES = ADMISSION_CLASSES.map((grade) => ({ value: grade, label: grade }));

const TYPING_MS = 850;
const OPTIONS_MS = 420;

export function AdmissionsChat({
  grades = ADMISSION_GRADE_CHOICES,
  gradeLabel = "Admission for",
}: {
  grades?: readonly { value: string; label: string }[];
  gradeLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const idRef = useRef(1);
  const greeted = useRef(false);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stepId, setStepId] = useState<StepId>("welcome");
  const [typing, setTyping] = useState(true);
  const [optionsReady, setOptionsReady] = useState(false);
  const [visited, setVisited] = useState<StepId[]>([]);
  const [draft, setDraft] = useState("");

  const step = STEPS[stepId];
  const activeForm = [...messages].reverse().find((message) => message.form);
  const formActive = Boolean(activeForm);
  const choices = typing || !optionsReady || formActive ? [] : choicesFor(stepId, visited);
  const showMainMenu = optionsReady && !typing && !formActive && stepId !== "welcome" && stepId !== "fallback" && stepId !== "academics" && stepId !== "campus" && stepId !== "sports" && !stepId.startsWith("thanks");

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const align = () => {
      const last = scroller.lastElementChild;
      if (!(last instanceof HTMLElement)) return;
      const top = last.offsetTop;
      if (last.offsetHeight > scroller.clientHeight) {
        scroller.scrollTop = top;
        return;
      }
      scroller.scrollTop = Math.max(0, top + last.offsetHeight - scroller.clientHeight);
    };
    align();
    const frame = window.requestAnimationFrame(align);
    return () => window.cancelAnimationFrame(frame);
  }, [messages, typing, open, choices.length]);

  function later(ms: number, run: () => void) {
    const id = window.setTimeout(run, ms);
    timers.current.push(id);
  }

  useEffect(() => {
    if (!open || greeted.current) return;
    let cancelled = false;
    busy.current = true;
    const opening = openingTranscript();
    const botLines = opening.lines.filter((line) => line.role === "bot");
    const replyTimer = window.setTimeout(() => {
      if (cancelled) return;
      greeted.current = true;
      setMessages((current) => [...current, ...botLines.map((line) => toMessage(line, idRef.current++))]);
      setStepId(opening.stepId);
      setTyping(false);
      const buttonTimer = window.setTimeout(() => {
        if (cancelled) return;
        setOptionsReady(true);
        busy.current = false;
      }, OPTIONS_MS);
      timers.current.push(buttonTimer);
    }, TYPING_MS);
    timers.current.push(replyTimer);
    return () => {
      if (greeted.current) return;
      cancelled = true;
      window.clearTimeout(replyTimer);
    };
  }, [open]);

  useEffect(() => () => {
    timers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  function showReply(to: StepId) {
    const next = STEPS[to];
    const id = idRef.current++;
    const reply: ChatMessage = next.form
      ? { id, role: "bot", text: next.text, stepId: to, form: next.form }
      : { id, role: "bot", text: next.text, stepId: to };
    setMessages((current) => [...current, reply]);
    setStepId(to);
    setVisited((current) => (current.includes(to) ? current : [...current, to]));
    setTyping(false);
    later(OPTIONS_MS, () => {
      setOptionsReady(true);
      busy.current = false;
    });
  }

  function go(to: StepId, userText?: string) {
    if (busy.current) return;
    busy.current = true;
    setOptionsReady(false);
    setTyping(true);
    setMessages((current) => {
      const cleared = current.map(withoutForm);
      if (!userText) return cleared;
      return [...cleared, { id: idRef.current++, role: "user", text: userText }];
    });
    later(TYPING_MS, () => showReply(to));
  }

  function onType(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    go(resolveIncoming(text) ?? "fallback", text);
  }

  function finishForm(messageId: number, thanks: StepId) {
    busy.current = true;
    setOptionsReady(false);
    setTyping(true);
    setMessages((current) => current.map((message) => (message.id === messageId ? withoutForm(message) : message)));
    later(TYPING_MS, () => showReply(thanks));
  }

  return (
    <>
      {open ? (
        <section
          id="chat-widget"
          aria-label="Ekaaya admissions chat"
          className="fixed bottom-[4.25rem] left-3 right-3 top-20 z-40 flex flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:bottom-6 sm:left-auto sm:right-6 sm:top-auto sm:h-[min(40rem,calc(100vh-4.5rem))] sm:w-[24rem]"
        >
          <header className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-sm font-semibold leading-tight">Ekaaya International School</p>
              <p className="text-xs text-primary-foreground/80">Admissions Open | Pre-K to Grade 4</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1.5 hover:bg-primary-foreground/10">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={scrollerRef} className={`flex-1 basis-0 space-y-3 overflow-y-auto bg-muted/40 px-3 pt-3 pb-1 ${formActive ? "min-h-[28%]" : "min-h-[42%]"}`} role="log" aria-live="polite">
            {messages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}
            {typing && <TypingDots />}
          </div>

          <div className={`min-h-0 shrink overflow-y-auto px-3 pb-2 pt-1 ${formActive ? "max-h-[68%] border-t border-border bg-card pt-2.5" : "max-h-[48%] bg-muted/40"}`}>
            {activeForm?.form && (
              <ChatLeadForm
                spec={activeForm.form}
                grades={grades}
                gradeLabel={gradeLabel}
                onSuccess={() => finishForm(activeForm.id, activeForm.form?.thanks ?? "thanks-enquiry")}
              />
            )}
            {choices.length > 0 && (
              <div className="animate-in fade-in">
                {step.optionsTitle && (
                  <p className="mb-1.5 font-serif text-[13px] italic leading-snug text-brand-brown">{step.optionsTitle}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                {choices.map((choice) => (
                  <button
                    key={choice.label}
                    type="button"
                    onClick={() => go(choice.to, choice.label)}
                    className="rounded-full border border-primary/70 bg-background px-2.5 py-1 text-xs font-medium leading-snug text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    {choice.label}
                  </button>
                ))}
                </div>
              </div>
            )}
            {optionsReady && !typing && (showMainMenu || stepId !== "contact") && (
              <div className={`flex gap-4 text-xs font-semibold text-primary ${choices.length > 0 ? "mt-3" : ""}`}>
                {showMainMenu && (
                  <button type="button" onClick={() => go("welcome", "Main menu")} disabled={typing} className="underline disabled:opacity-50">
                    Main menu
                  </button>
                )}
                {stepId !== "contact" && (
                  <button type="button" onClick={() => go("contact", "Contact")} disabled={typing} className="underline disabled:opacity-50">
                    Contact
                  </button>
                )}
              </div>
            )}
            {!formActive && (
              <form onSubmit={onType} className="mt-3 flex gap-2">
                <label className="sr-only" htmlFor="chat-draft">Message</label>
                <input
                  id="chat-draft"
                  value={draft}
                  maxLength={300}
                  disabled={typing || !optionsReady}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                />
                <button type="submit" className="rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground disabled:opacity-60" disabled={typing || !optionsReady || !draft.trim()}>
                  Send
                </button>
              </form>
            )}
          </div>
        </section>
      ) : (
        <button
          id="chat-widget"
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-0 left-1/3 z-50 flex w-1/3 items-center justify-center gap-1.5 border-x border-background bg-primary py-3.5 text-sm font-semibold text-primary-foreground sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto sm:gap-2 sm:rounded-full sm:border-0 sm:px-4 sm:py-3 sm:shadow-lg [&_svg]:pointer-events-none"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="sm:hidden">Chat</span>
          <span className="hidden sm:inline">Admissions chat</span>
        </button>
      )}
    </>
  );
}

function TypingDots() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-3.5 py-3" aria-label="Typing">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const mine = message.role === "user";
  let body: ReactNode = message.text;
  if (message.stepId === "contact") body = <ContactBody />;

  return (
    <div className={mine ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          mine
            ? "max-w-[85%] animate-in fade-in whitespace-pre-line rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-primary-foreground"
            : "max-w-[90%] animate-in fade-in whitespace-pre-line rounded-2xl rounded-bl-md border border-border bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground shadow-sm"
        }
      >
        {body}
      </div>
    </div>
  );
}
