import { createServerFn } from "@tanstack/react-start";
import { postEnquiry, prepareLead, type EnquiryInput } from "@/lib/simply-admission";

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((input: EnquiryInput) => input)
  .handler(async ({ data }) => {
    const prepared = prepareLead(data);
    if (!prepared.ok) {
      console.error("[crm] rejected input", prepared.error);
      return prepared;
    }
    const apiKey = process.env["SIMPLY_ADMISSION_API_KEY"] ?? "";
    const result = await postEnquiry(prepared.body, apiKey);
    if (!result.ok) console.error("[crm] send failed", result.error);
    return result;
  });
