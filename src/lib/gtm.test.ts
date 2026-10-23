import { describe, expect, it } from "vitest";
import { CALL_BUTTON_CLICK, WHATSAPP_BUTTON_CLICK, installClickTracking, trackingEventForHref } from "./gtm";

describe("trackingEventForHref", () => {
  it("recognises call and WhatsApp links", () => {
    expect(trackingEventForHref("tel:+918866352292")).toBe(CALL_BUTTON_CLICK);
    expect(trackingEventForHref("TEL:+918866352292")).toBe(CALL_BUTTON_CLICK);
    expect(trackingEventForHref("https://wa.me/918866352292?text=Hi")).toBe(WHATSAPP_BUTTON_CLICK);
    expect(trackingEventForHref("https://api.whatsapp.com/send?phone=918866352292")).toBe(WHATSAPP_BUTTON_CLICK);
    expect(trackingEventForHref("mailto:info@ekaaya.education")).toBeNull();
    expect(trackingEventForHref("#visit")).toBeNull();
  });
});

describe("installClickTracking", () => {
  it("pushes a dataLayer event for every call and WhatsApp click", () => {
    document.body.innerHTML = `
      <a href="tel:+918866352292">Call</a>
      <a href="https://wa.me/918866352292"><span>WhatsApp</span></a>
      <a href="mailto:info@ekaaya.education">Email</a>
    `;
    window.dataLayer = [];
    const remove = installClickTracking();

    const click = (node: Element | null) => {
      node?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    };
    document.addEventListener("click", (event) => event.preventDefault());
    click(document.querySelector("a"));
    click(document.querySelector("span"));
    click(document.querySelector("a[href^='mailto']"));

    expect(window.dataLayer).toEqual([{ event: CALL_BUTTON_CLICK }, { event: WHATSAPP_BUTTON_CLICK }]);
    remove();
    document.body.innerHTML = "";
  });
});
