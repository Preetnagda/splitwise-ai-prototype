import { parseImage } from "@/lib/image-parser";
import { ReceiptSchema, Receipt } from "@/lib/image-parser-schema";
import { imageParserPrompt } from "@/prompts/system-prompts";

const MAX_ATTEMPTS = 3;
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
    const result = await parseImage(imageBuffer, ReceiptSchema, imageParserPrompt);
    lastResult = result;

    if (!result.found) {
      return Response.json(result);
    }

    if (isTotalValid(result)) {
      return Response.json(result);
    }
  }

  return Response.json(lastResult);
}
