import { streamText, Output, ModelMessage } from "ai";
import { SplitResultSchema } from "@/lib/split-schema";
import { getModel } from "@/lib/model-registry";
import { buildSplitSystemPrompt } from "@/prompts/system-prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { total, description, members, messages } = await req.json();

  const memberList = (members as { id: string; name: string }[])
    .map((m) => `- id: "${m.id}", name: "${m.name}"`)
    .join("\n");

  console.log('INPUT MESSAGES', messages);
  const result = streamText({
    model: getModel("split-model"),
    output: Output.object({ schema: SplitResultSchema }),
    system: buildSplitSystemPrompt({ total, description, memberList }),
    messages: messages as ModelMessage[],
  });

  return result.toTextStreamResponse();
}
