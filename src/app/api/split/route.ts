import { streamText, Output, ModelMessage, tool, stepCountIs } from "ai";
import { evaluate } from "mathjs";
import { z } from "zod";
import { SplitResultSchema } from "@/lib/split-schema";
import { getModel } from "@/lib/model-registry";
import { buildSplitSystemPrompt } from "@/prompts/system-prompts";

export const maxDuration = 30;

const calculatorTool = tool({
  description: "Evaluate a math expression to verify split calculations are correct (e.g. sums, percentages)",
  inputSchema: z.object({
    expression: z.string().describe("A mathematical expression to evaluate, e.g. '25 + 25 + 30 + 20'"),
  }),
  execute: async ({ expression }) => {
    const result = evaluate(expression);
    return { result: String(result) };
  },
});

export async function POST(req: Request) {
  const { total, description, members, messages, complexity } = await req.json();

  let reasoningEffort = 'low';
  if(complexity == 'high'){
    reasoningEffort = 'medium';
  }

  const memberList = (members as { id: string; name: string }[])
    .map((m) => `- id: "${m.id}", name: "${m.name}"`)
    .join("\n");

  console.log('Starting split AI call', {
    reasoningEffort, messages
  });

  const result = streamText({
    model: getModel("split-model"),
    providerOptions: {
      openai: { reasoningEffort },
    },
    tools: { calculator: calculatorTool },
    output: Output.object({ schema: SplitResultSchema }),
    system: buildSplitSystemPrompt({ total, description, memberList }),
    messages: messages as ModelMessage[],
    stopWhen: stepCountIs(15),
    onStepFinish({ stepNumber, finishReason, usage, toolCalls, toolResults }) {
      console.log(`[split] step=${stepNumber} finish=${finishReason} tokens=${usage.inputTokens}in/${usage.outputTokens}out`);
      for (const call of toolCalls) {
        console.log(`[split]   tool_call: ${call.toolName}`, call.input);
      }
      for (const r of toolResults) {
        console.log(`[split]   tool_result: ${r.toolName}`, r.output);
      }
    },
  });

  return result.toTextStreamResponse();
}
