"use client";

import { useRef } from "react";
import { useAi } from "@/lib/ai-context";

export function AiPromptBox() {
  const { aiPrompt, isLoading, setAiPrompt, handleAiSubmit } = useAi();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="border-t border-gray-200 px-4 py-3 mt-4 bg-white sticky bottom-0">
      <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2">
        <textarea
          ref={textareaRef}
          value={aiPrompt}
          onChange={(e) => {
            setAiPrompt(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAiSubmit();
            }
          }}
          placeholder="Describe how to split this expense…"
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none resize-none max-h-32 leading-5 py-1 disabled:opacity-50"
        />
        <button
          onClick={handleAiSubmit}
          disabled={isLoading || !aiPrompt.trim()}
          className="shrink-0 w-8 h-8 rounded-full bg-[#5bc5a7] flex items-center justify-center transition-colors hover:bg-[#4aad91] disabled:opacity-40 disabled:cursor-not-allowed mb-0.5"
        >
          {isLoading ? (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-[10px] text-gray-400 mt-1.5 text-center">
        AI will set the split type and amounts — you can adjust manually after
      </p>
    </div>
  );
}
