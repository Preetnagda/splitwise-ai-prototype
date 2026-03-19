import { z } from "zod";

export const SplitResultSchema = z.object({
  splitType: z.enum(["equal", "share", "percent", "absolute"]).describe(
    "The split type to use. 'equal' = everyone splits equally. 'share' = weighted shares (e.g. 3 nights vs 1 night). 'percent' = explicit percentages. 'absolute' = fixed dollar amounts per person."
  ),
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
});
