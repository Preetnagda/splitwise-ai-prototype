import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { getModel } from "./model-registry";

export type ImageInput =
  | string // base64 string, data URL, or http(s) URL
  | URL
  | ArrayBuffer
  | Uint8Array
  | Buffer;

export async function parseImage<T extends z.ZodTypeAny>(
  image: ImageInput,
  schema: T,
  prompt: string
): Promise<z.infer<T>> {
  const { object } = await generateObject({
    model: getModel('image-parser-model'),
    schema,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image", image: image as string | URL | ArrayBuffer | Uint8Array | Buffer },
        ],
      },
    ],
  });

  return object as z.infer<T>;
}
