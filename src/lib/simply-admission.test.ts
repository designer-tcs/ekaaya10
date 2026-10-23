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
      sectionName: " Campus Tour ",
      formName: "Book a Campus Tour",
      note: "page: tour-page · tour: 2026-10-22 9:30 – 10:30 AM",
      utm: { UTM_Source: "google", utm_term: "vadodara school", ignored: "no" },
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
      udf_JQFIQWACOKFZASGRXBKHANWJNAVWDA: "Campus Tour",
      udf_MENENADGOKAXDHCXHBPRKRQYRWKARQ: "Book a Campus Tour",
      remarks: "page: tour-page · tour: 2026-10-22 9:30 – 10:30 AM",
      utm_source: "google",
      utm_term: "vadodara school",
      udf_GKVCPLBVSMLDOZOLTEWWDMDRFFJSPH: "Form Fill",
      udf_XFNEPCTAIODGPIJFWGFDBFBAFMKOLD: "Form Fill, Whatsapp",
      udf_OGLFUXYRCBMQWKOBHPKIPXTGHTRFAP: "Google Ads",
      udf_RXRFEWGKFDNGZGCGWWEVJULGDVONRE: "vadodara school",
    });
    expect(prepared.body["ignored"]).toBeUndefined();
    expect(prepared.body["UTM_Source"]).toBeUndefined();
  });

  it("writes the Google Ads URL into the Simply Admission custom fields", () => {
    const prepared = prepareLead({
      name: "Asha Patel",
      phone: "9876543210",
      grade: "Nursery",
      sourceName: "Quick Enquiry",
      utm: {
        utm_source: "GoogleAds",
        utm_medium: "Brand Ad Group",
        utm_campaign: "Ekaaya Search",
        utm_term: "vadodara school",
        utm_content: "creative-1",
        utm_Device: "m",
        utm_Gender: "Female",
        utm_HouseholdIncome: "Top 10%",
        utm_AgeGroup: "25-34",
        gclid: "click-123",
        formUrl: "https://www.admission.ekaaya.education/?utm_source=GoogleAds",
      },
    });

    expect(prepared.ok).toBe(true);
    if (!prepared.ok) return;
    expect(prepared.body).toMatchObject({
      utm_source: "GoogleAds",
      utm_medium: "Brand Ad Group",
      utm_campaign: "Ekaaya Search",
      utm_term: "vadodara school",
      utm_content: "creative-1",
      udf_GKVCPLBVSMLDOZOLTEWWDMDRFFJSPH: "Form Fill",
      udf_OGLFUXYRCBMQWKOBHPKIPXTGHTRFAP: "Google Ads",
      udf_XFNEPCTAIODGPIJFWGFDBFBAFMKOLD: "Form Fill, Whatsapp",
      udf_RXRFEWGKFDNGZGCGWWEVJULGDVONRE: "vadodara school",
      udf_AQWGRQBVUIUGWKPQRVHIIVTWWLHYFU: "creative-1",
      udf_RSQQZWIRYBBIAKSPDIPKFXLWFDLEGS: "https://www.admission.ekaaya.education/?utm_source=GoogleAds",
      udf_TLWZSXLNVEBCGGZEPBASLNZRLZRIRC: "click-123",
      udf_XHPEKCQKBWIVLUWHTGEYULDJNMOJDP: "m",
      udf_QTRGBYMJKKXGMKXAXZCMTCJMPHFEMD: "Female",
      udf_JOSMRAABQDLGCRICPUZVFVHCIILOMP: "Top 10%",
      udf_MLCWLSINAKLYUTGFYHTQSDSBKEMDCH: "25-34",
    });
  });

  it("drops unresolved Google Ads placeholders", () => {
    const prepared = prepareLead({
      name: "Asha Patel",
      phone: "9876543210",
      grade: "Nursery",
      sourceName: "Quick Enquiry",
      utm: { utm_term: "{keyword}", gclid: "{gclid}", utm_source: "GoogleAds" },
    });

    expect(prepared.ok).toBe(true);
    if (!prepared.ok) return;
    expect(prepared.body["utm_term"]).toBeUndefined();
    expect(prepared.body["udf_RXRFEWGKFDNGZGCGWWEVJULGDVONRE"]).toBeUndefined();
    expect(prepared.body["udf_TLWZSXLNVEBCGGZEPBASLNZRLZRIRC"]).toBeUndefined();
    expect(prepared.body["utm_source"]).toBe("GoogleAds");
    expect(prepared.body["udf_OGLFUXYRCBMQWKOBHPKIPXTGHTRFAP"]).toBe("Google Ads");
  });

  it("uses Facebook Ads only when the click is from Facebook", () => {
    const facebook = prepareLead({
      name: "Asha Patel",
      phone: "9876543210",
      grade: "Nursery",
      sourceName: "Quick Enquiry",
      utm: { utm_source: "facebook" },
    });
    const direct = prepareLead({
      name: "Asha Patel",
      phone: "9876543210",
      grade: "Nursery",
      sourceName: "Quick Enquiry",
    });

    expect(facebook.ok && facebook.body["udf_OGLFUXYRCBMQWKOBHPKIPXTGHTRFAP"]).toBe("Facebook Ads");
    expect(direct.ok && direct.body["udf_OGLFUXYRCBMQWKOBHPKIPXTGHTRFAP"]).toBeFalsy();
    expect(direct.ok && direct.body["udf_GKVCPLBVSMLDOZOLTEWWDMDRFFJSPH"]).toBe("Form Fill");
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
