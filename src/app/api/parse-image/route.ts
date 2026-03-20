import { parseImage } from "@/lib/image-parser";
import { ReceiptSchema, Receipt } from "@/lib/image-parser-schema";
import { imageParserPrompt } from "@/prompts/system-prompts";

const MAX_ATTEMPTS = 2;
const TOLERANCE = 0.01;

function isTotalValid(receipt: Receipt): boolean {
  const itemsSum = receipt.items.reduce((sum, item) => sum + item.amount, 0);
  return Math.abs(itemsSum - receipt.total) <= TOLERANCE;
}

function dataUrlToBuffer(dataUrl: string): Buffer {
  const base64 = dataUrl.split(",")[1];
  return Buffer.from(base64, "base64");
}

export async function POST(req: Request) {
  const { image } = await req.json();
  const imageBuffer = dataUrlToBuffer(image);

  let lastResult: Receipt | undefined;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const prompt = lastResult
      ? `${imageParserPrompt}\n\nYour previous response was invalid:\n${JSON.stringify(lastResult)}\nThe item amounts sum to ${lastResult.items.reduce((s, i) => s + i.amount, 0).toFixed(2)} but the total is ${lastResult.total.toFixed(2)}. Re-examine the receipt and correct the values.`
      : imageParserPrompt;

    const result = await parseImage(imageBuffer, ReceiptSchema, prompt);
    lastResult = result;

    console.log(`IMAGE PARSER RESULT (attempt ${attempt + 1}):`, result);

    if (!result.found) {
      return Response.json(result);
    }

    if (isTotalValid(result)) {
      return Response.json(result);
    }
  }

  return Response.json(lastResult);
}
