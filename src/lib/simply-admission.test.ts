import { describe, expect, it, vi } from "vitest";
import { mapClass, normalizeMobile, postEnquiry, prepareLead } from "./simply-admission";

describe("normalizeMobile", () => {
  it("keeps a 10-digit number and strips country code or spaces", () => {
    expect(normalizeMobile("9876543210")).toBe("9876543210");
    expect(normalizeMobile("+91 98765 43210")).toBe("9876543210");
    expect(normalizeMobile("09876543210")).toBe("9876543210");
  });

  it("rejects numbers that are not 10 digits", () => {
    expect(normalizeMobile("12345")).toBeNull();
    expect(normalizeMobile("")).toBeNull();
  });
});

describe("mapClass", () => {
  it("accepts the CRM class names and the older form labels", () => {
    expect(mapClass("Junior KG")).toBe("Junior KG");
    expect(mapClass("Jr.KG")).toBe("Junior KG");
    expect(mapClass("Sr.KG")).toBe("Senior KG");
    expect(mapClass("Grade 4")).toBe("Grade 4");
  });

  it("rejects classes the CRM does not have", () => {
    expect(mapClass("Grade 5")).toBeNull();
    expect(mapClass("KG")).toBeNull();
  });
});

describe("prepareLead", () => {
  it("builds the payload Simply Admission expects", () => {
    const prepared = prepareLead({
      name: "  Asha Patel ",
      phone: "+91 98765 43210",
      email: "asha@example.com",
      grade: "Jr.KG",
      sourceName: "Book a Tour",
      note: "page: tour-page · tour: 2026-10-22 9:30 – 10:30 AM",
      utm: { UTM_Source: "google", UTM_Term: "vadodara school", ignored: "no" },
    });

    expect(prepared.ok).toBe(true);
    if (!prepared.ok) return;
    expect(prepared.body).toMatchObject({
      name: "Asha Patel",
      mobileNo: "9876543210",
      emailId: "asha@example.com",
      acadyearName: "2027-28",
      className: "Junior KG",
      sourceName: "Book a Tour",
      udf_AQYJBOUJCGNZOZVJGFYAVHRQSKWMEW: "Book a Tour",
      remarks: "page: tour-page · tour: 2026-10-22 9:30 – 10:30 AM",
      UTM_Source: "google",
      UTM_Term: "vadodara school",
    });
    expect(prepared.body["ignored"]).toBeUndefined();
  });

  it("requires a usable class and a real mobile number", () => {
    expect(prepareLead({ name: "Asha", phone: "123", grade: "Grade 1", sourceName: "Quick Enquiry" }).ok).toBe(false);
    expect(prepareLead({ name: "Asha", phone: "9876543210", grade: "Grade 8", sourceName: "Quick Enquiry" }).ok).toBe(false);
  });
});

describe("postEnquiry", () => {
  it("treats a created lead and an existing student as success", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      json: async () => ({ message: "Enquiry Created", status: 200 }),
    });
    await expect(postEnquiry({ name: "Asha" }, "key", fetchImpl)).resolves.toEqual({ ok: true });

    fetchImpl.mockResolvedValueOnce({
      json: async () => ({ message: "Student Already Exist", status: 200 }),
    });
    await expect(postEnquiry({ name: "Asha" }, "key", fetchImpl)).resolves.toEqual({ ok: true });
  });

  it("returns a failure when the CRM rejects the payload", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      json: async () => ({ error_message: "Please select class.", status: false, code: 400 }),
    });
    const result = await postEnquiry({ name: "Asha" }, "key", fetchImpl);
    expect(result.ok).toBe(false);
  });
});
