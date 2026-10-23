/** Pushes click events onto the Google Tag Manager dataLayer. */

export const CALL_BUTTON_CLICK = "call_button_click";
export const WHATSAPP_BUTTON_CLICK = "whatsapp_button_click";

export type ClickTrackingEvent = typeof CALL_BUTTON_CLICK | typeof WHATSAPP_BUTTON_CLICK;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** A call link uses tel:. A WhatsApp link opens wa.me or whatsapp.com. */
export function trackingEventForHref(href: string | null | undefined): ClickTrackingEvent | null {
  if (!href) return null;
  const value = href.trim();
  if (/^tel:/i.test(value)) return CALL_BUTTON_CLICK;

  let url: URL;
  try {
    url = new URL(value, "https://www.admission.ekaaya.education");
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host === "wa.me" || host === "api.whatsapp.com" || host === "whatsapp.com" || host === "web.whatsapp.com") {
    return WHATSAPP_BUTTON_CLICK;
  }
  return null;
}

export function pushClickEvent(event: ClickTrackingEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event });
}

/** Listens for clicks on any call or WhatsApp link, including ones added later. */
export function installClickTracking(target: Document | DocumentFragment = document) {
  const onClick = (event: Event) => {
    const node = event.target;
    if (!(node instanceof Element)) return;
    const link = node.closest("a");
    if (!link) return;
    const name = trackingEventForHref(link.getAttribute("href"));
    if (name) pushClickEvent(name);
  };
  target.addEventListener("click", onClick, true);
  return () => target.removeEventListener("click", onClick, true);
}
