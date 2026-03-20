"use client";

import { useRef } from "react";
import { useAi } from "@/lib/ai-context";
import { AttachIcon } from "@/components/image/AttachIcon";
import { CloseIcon } from "@/components/image/CloseIcon";
import { SpinnerIcon } from "@/components/image/SpinnerIcon";
import { SendIcon } from "@/components/image/SendIcon";

export function AiPromptBox() {
  const { aiPrompt, isLoading, isParsing, attachedImage, setAiPrompt, setAttachedImage, handleAiSubmit, messages } = useAi();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const busy = isLoading || isParsing;
  const canSubmit = !busy && (!!aiPrompt.trim() || !!attachedImage);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAttachedImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="border-t border-gray-200 px-4 py-3 mt-4 bg-white sticky bottom-0">
      {/* Image preview */}
      {attachedImage && (
        <div className="relative inline-block mb-2">
          <img src={attachedImage} alt="Receipt" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
          <button
            onClick={() => setAttachedImage(null)}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center"
          >
            <CloseIcon width={8} height={8} stroke="white" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2">
        {/* Attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
          className="shrink-0 text-gray-400 hover:text-gray-600 disabled:opacity-40 mb-1"
        >
          <AttachIcon width={18} height={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

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
          placeholder={messages.length == 0 ? "Describe how to split this expense..." : "Something not quite right? Ask me to fix it."}
          rows={1}
          disabled={busy}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none resize-none max-h-32 leading-5 py-1 disabled:opacity-50"
        />

        <button
          onClick={handleAiSubmit}
          disabled={!canSubmit}
          className="shrink-0 w-8 h-8 rounded-full bg-[#5bc5a7] flex items-center justify-center transition-colors hover:bg-[#4aad91] disabled:opacity-40 disabled:cursor-not-allowed mb-0.5"
        >
          {busy ? <SpinnerIcon width={14} height={14} stroke="white" /> : <SendIcon width={14} height={14} stroke="white" />}
        </button>
      </div>
      <p className="text-[10px] text-gray-400 mt-1.5 text-center">
        AI will set the split type and amounts — you can adjust manually after
      </p>
    </div>
  );
}
