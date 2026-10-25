import { describe, expect, it } from "vitest";
import { PREFILL_PROMPTS, STEPS, chatLeadNote, choicesFor, openingTranscript, resolveIncoming } from "@/lib/chat-flow";

describe("admissions chatbot flow", () => {
  it("opens with the welcome message and the four main options", () => {
    const opening = openingTranscript();
    expect(opening.stepId).toBe("welcome");
    expect(opening.lines.map((line) => line.role)).toEqual(["bot"]);
    expect(STEPS.welcome.text).not.toContain("What more would you like to know?");
    expect(STEPS.welcome.optionsTitle).toBe("What more would you like to know?");
    expect(STEPS.different.optionsTitle).toBe("What more would you like to know about what makes Ekaaya different?");
    expect(STEPS["thanks-fees"].optionsTitle).toBe("What else would you like to know?");
    expect(STEPS.welcome.choices?.map((choice) => choice.label)).toEqual([
      "What Makes Ekaaya Different?",
      "Fee Details",
      "Speak to a Counsellor",
      "Schedule a Campus Visit",
    ]);
  });

  it("treats the ad prefills as the welcome flow", () => {
    for (const prompt of PREFILL_PROMPTS) {
      expect(resolveIncoming(prompt)).toBe("welcome");
      const opening = openingTranscript(prompt);
      expect(opening.stepId).toBe("welcome");
      expect(opening.lines[0]).toMatchObject({ role: "user", text: prompt });
    }
  });

  it("follows each button to the scripted next step", () => {
    expect(resolveIncoming("What Makes Ekaaya Different?")).toBe("different");
    expect(resolveIncoming("Fee Details")).toBe("fees");
    expect(resolveIncoming("Speak to a Counsellor")).toBe("counsellor");
    expect(resolveIncoming("Schedule a Campus Visit")).toBe("visit");
    expect(STEPS.different.choices?.map((choice) => choice.to)).toEqual(["academics", "campus", "sports"]);
    expect(STEPS.academics.choices?.[0]).toMatchObject({ label: "Enquire About Academics", to: "lead-academics" });
    expect(STEPS.campus.choices?.[0]).toMatchObject({ label: "Schedule a Campus Visit", to: "visit-form" });
    expect(STEPS.sports.choices?.[0]).toMatchObject({ label: "Discover More About Ekaaya", to: "lead-sports" });
    expect(STEPS.visit.choices?.[0]).toMatchObject({ label: "Book My Campus Visit", to: "visit-form" });
  });

  it("keeps unvisited topics and the other main paths beside a topic description", () => {
    const labels = choicesFor("academics", ["different", "academics"]).map((choice) => choice.label);

    expect(labels).toEqual([
      "Enquire About Academics",
      "Campus & Infrastructure",
      "Sports & Holistic Development",
      "Fee Details",
      "Speak to a Counsellor",
      "Schedule a Campus Visit",
    ]);
    expect(labels).not.toContain("What Makes Ekaaya Different?");
  });

  it("drops a topic once it has been opened", () => {
    const labels = choicesFor("campus", ["different", "academics", "campus"]).map((choice) => choice.label);

    expect(labels).not.toContain("Academics & Learning");
    expect(labels).toContain("Sports & Holistic Development");
    expect(labels).toContain("Fee Details");
  });

  it("writes the enquiry type, child, and email into the CRM note", () => {
    const fees = STEPS.fees.form;
    const visit = STEPS["visit-form"].form;
    expect(fees && chatLeadNote(fees, { child: "Aarav", email: "parent@example.com" })).toBe(
      "Enquiry: Fee Details · Child: Aarav · Email: parent@example.com",
    );
    expect(visit && chatLeadNote(visit, { child: "Aarav", email: "parent@example.com", when: "Mon, 2 Nov", slot: "9:30 – 10:30 AM" })).toBe(
      "Enquiry: Book My Campus Visit · Child: Aarav · Email: parent@example.com · Visit: Mon, 2 Nov 9:30 – 10:30 AM",
    );
  });

  it("asks for visit details only on the campus visit form", () => {
    expect(STEPS.fees.form).toMatchObject({ kind: "enquiry", submitLabel: "Submit Enquiry", thanks: "thanks-fees" });
    expect(STEPS.counsellor.form).toMatchObject({ kind: "enquiry", submitLabel: "Submit Enquiry", thanks: "thanks-callback" });
    expect(STEPS["visit-form"].form).toMatchObject({ kind: "visit", submitLabel: "Confirm Visit Request", thanks: "thanks-visit" });
    expect(STEPS["thanks-fees"].text).toContain("fee details");
    expect(STEPS["thanks-visit"].text).toContain("confirm your preferred date and time");
  });
});
