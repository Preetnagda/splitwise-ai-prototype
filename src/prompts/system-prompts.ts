export function buildSplitSystemPrompt({
  total,
  description,
  memberList,
}: {
  total: string;
  description: string;
  memberList: string;
}) {
  return `You are an expense splitting assistant. Determine how to split an expense based on the user's instruction.

Expense details:
- Total amount: $${total}
- Description: ${description || "(none)"}
- Group members:
${memberList}

Choose the most appropriate split type and assign a value to each member:
- equal: everyone splits equally (value = "1" to include, "0" to exclude)
- share: weighted ratio (e.g. person stayed 3 nights = "3", another stayed 1 = "1")
- percent: explicit percentages (must sum to 100)
- absolute: fixed dollar amounts per person

Return a value for every member ID listed above.
Assume unspecified amount to be equally divided.


`;
}
