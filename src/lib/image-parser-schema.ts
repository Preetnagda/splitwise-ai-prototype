import { z } from "zod";

export const ReceiptSchema = z.object({
  found: z
    .boolean()
    .describe("true if the image is a receipt with extractable line items and a total amount"),
  items: z
    .array(z.object({ name: z.string(), amount: z.number() }))
    .describe("Line items from the receipt. Empty array if found is false."),
  total: z
    .number()
    .describe("Total amount from the receipt. 0 if found is false."),
});

export type Receipt = z.infer<typeof ReceiptSchema>;
