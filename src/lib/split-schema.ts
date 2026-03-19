import { z } from "zod";

const TOLERANCE = 0.01;

export const SplitResultSchema = z
  .object({
    splitType: z.enum(["equal", "share", "percent", "absolute"]).describe(
      "The split type to use. 'equal' = everyone splits equally. 'share' = weighted shares (e.g. 3 nights vs 1 night). 'percent' = explicit percentages. 'absolute' = fixed dollar amounts per person."
    ),
    total: z
      .number()
      .describe("The total expense amount. Must match the total provided in the system prompt."),
    memberValues: z
      .array(
        z.object({
          id: z.string().describe("Member ID exactly as provided"),
          value: z.string().describe(
            "The value for this member: share count (e.g. '3'), percent (e.g. '60'), or absolute dollar amount (e.g. '40.00'). For 'equal' splitType, use '1' for included members and '0' to exclude."
          ),
        })
      )
      .describe("One entry per member, covering every member ID provided"),
  })
  .refine(
    (data) => {
      if (data.splitType !== "percent") return true;
      const sum = data.memberValues.reduce((acc, m) => acc + parseFloat(m.value || "0"), 0);
      return Math.abs(sum - 100) <= TOLERANCE;
    },
    { message: "Percent values must sum to exactly 100" }
  )
  .refine(
    (data) => {
      if (data.splitType !== "absolute") return true;
      const sum = data.memberValues.reduce((acc, m) => acc + parseFloat(m.value || "0"), 0);
      return Math.abs(sum - data.total) <= TOLERANCE;
    },
    { message: "Absolute values must sum to the total amount" }
  );
