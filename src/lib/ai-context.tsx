"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import toast from "react-hot-toast";
import { useExpense, GROUP_MEMBERS } from "./expense-context";
import { useSplit } from "./split-context";
import { SplitResultSchema } from "./split-schema";
import { Receipt } from "./image-parser-schema";
import { z } from "zod";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type SplitResult = z.infer<typeof SplitResultSchema>;

function formatSplitResult(result: SplitResult): string {
  const typeLabel: Record<string, string> = {
    equal: "equally",
    share: "by shares",
    percent: "by percent",
    absolute: "by fixed amounts",
  };
  const memberDescriptions = result.memberValues
    .map((mv) => {
      const member = GROUP_MEMBERS.find((m) => m.id === mv.id);
      const name = member?.isYou ? "You" : (member?.name ?? mv.id);
      return `${name}: ${mv.value}`;
    })
    .join(", ");
  return `Split ${typeLabel[result.splitType]}: ${memberDescriptions}`;
}

function formatReceiptSummary(receipt: Receipt): string {
  const itemList = receipt.items
    .map((item) => `${item.name} $${item.amount.toFixed(2)}`)
    .join(", ");
  return `Receipt items: ${itemList}. Total: $${receipt.total.toFixed(2)}`;
}

interface AiContextValue {
  aiPrompt: string;
  isLoading: boolean;
  isParsing: boolean;
  attachedImage: string | null;
  messages: ChatMessage[];
  setAiPrompt: (prompt: string) => void;
  setAttachedImage: (image: string | null) => void;
  handleAiSubmit: () => void;
}

const AiContext = createContext<AiContextValue | null>(null);

export function AiProvider({ children }: { children: ReactNode }) {
  const { expense } = useExpense();
  const { applyAiResult } = useSplit();

  const [aiPrompt, setAiPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const { submit, isLoading } = useObject({
    api: "/api/split",
    schema: SplitResultSchema,
    onFinish({ object, error }) {
      if (error) {
        toast.error("Oops, something went wrong.");
        return;
      }
      if (!object?.splitType || !object?.memberValues) {
        toast.error("Couldn't figure out the split. Try again");
        return;
      }
      applyAiResult(object.splitType, object.memberValues);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: formatSplitResult(object as SplitResult) },
      ]);
      setAiPrompt("");
    },
    onError() {
      toast.error("Oops, something went wrong.");
    },
  });

  async function handleAiSubmit() {
    const prompt = aiPrompt.trim();
    if ((!prompt && !attachedImage) || isLoading || isParsing) return;

    let imageContext = "";

    if (attachedImage) {
      setIsParsing(true);
      try {
        const res = await fetch("/api/parse-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: attachedImage }),
        });
        if (!res.ok) throw new Error();
        const receipt: Receipt = await res.json();
        if (!receipt.found) {
          toast.error("We can't understand this image. Try with again with a different one.");
          setIsParsing(false);
          return;
        }
        imageContext = formatReceiptSummary(receipt);
      } catch {
        toast.error("We can't process images at the moment");
        setIsParsing(false);
        return;
      }
      setIsParsing(false);
      setAttachedImage(null);
    }

    const fullContent = [prompt, imageContext].filter(Boolean).join("\n\n");

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: fullContent },
    ];
    setMessages(updatedMessages);

    submit({
      total: expense.amount,
      description: expense.description,
      members: GROUP_MEMBERS.map((m) => ({ id: m.id, name: m.isYou ? "You" : m.name })),
      messages: updatedMessages,
    });
  }

  return (
    <AiContext.Provider
      value={{
        aiPrompt,
        isLoading,
        isParsing,
        attachedImage,
        messages,
        setAiPrompt,
        setAttachedImage,
        handleAiSubmit,
      }}
    >
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const ctx = useContext(AiContext);
  if (!ctx) throw new Error("useAi must be used within AiProvider");
  return ctx;
}
