import { openai } from "@ai-sdk/openai";

const registry = {
  "split-model": openai("gpt-5.4"),
  "image-parser-model": openai("gpt-4o-2024-08-06"),
} as const;

type ModelKey = keyof typeof registry;

export function getModel(key: ModelKey) {
  return registry[key];
}
