"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import toast from "react-hot-toast";
import { useExpense, GROUP_MEMBERS } from "./expense-context";
import { useSplit } from "./split-context";
import { SplitResultSchema } from "./split-schema";
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

interface AiContextValue {
  aiPrompt: string;
  isLoading: boolean;
  messages: ChatMessage[];
  setAiPrompt: (prompt: string) => void;
  handleAiSubmit: () => void;
}

const AiContext = createContext<AiContextValue | null>(null);

export function AiProvider({ children }: { children: ReactNode }) {
  const { expense } = useExpense();
  const { applyAiResult } = useSplit();

  const [aiPrompt, setAiPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { submit, isLoading } = useObject({
    api: "/api/split",
    schema: SplitResultSchema,
    onFinish({ object, error }) {
      if (error || !object?.splitType || !object?.memberValues) {
        toast.error("Failed to process AI split. Check your API key.");
        return;
      }
      console.log('OUTPUT MESSAGE', object);
      applyAiResult(object.splitType, object.memberValues);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: formatSplitResult(object as SplitResult) },
      ]);
      setAiPrompt("");
    },
    onError() {
      toast.error("Failed to process AI split. Check your API key.");
    },
  });

  function handleAiSubmit() {
    const prompt = aiPrompt.trim();
    if (!prompt || isLoading) return;

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: prompt },
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
    <AiContext.Provider value={{ aiPrompt, isLoading, messages, setAiPrompt, handleAiSubmit }}>
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const ctx = useContext(AiContext);
  if (!ctx) throw new Error("useAi must be used within AiProvider");
  return ctx;
}
