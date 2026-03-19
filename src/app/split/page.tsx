"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useExpense, SplitType } from "@/lib/expense-context";
import { useSplit } from "@/lib/split-context";
import { MemberAvatar } from "@/components/MemberAvatar";
import { PageHeader } from "@/components/PageHeader";
import { AiPromptBox } from "@/components/AiPromptBox";

const SPLIT_TABS: { label: string; value: SplitType }[] = [
  { label: "Equal", value: "equal" },
  { label: "Shares", value: "share" },
  { label: "Percent", value: "percent" },
  { label: "Absolute", value: "absolute" },
];

export default function SplitPage() {
  const router = useRouter();
  const { expense, setExpense } = useExpense();
  const {
    splitType,
    members,
    calculated,
    total,
    percentTotal,
    absoluteTotal,
    showValueColumn,
    valueColumnLabel,
    handleSplitTypeChange,
    handleValueChange,
  } = useSplit();

  function handleSave() {
    setExpense({ ...expense, splitType });
    toast.success("Expense saved successfully!");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <PageHeader
        onLeft={() => router.back()}
        leftIcon="back"
        title="Split expense"
        subtitle={expense.description || undefined}
        onSave={handleSave}
      />

      {/* Total amount display */}
      <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total amount</span>
          <span className="text-xl font-semibold text-gray-800">
            ${total.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">Paid by you</span>
        </div>
      </div>

      {/* Split type selector */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Split type</p>
        <div className="flex gap-2">
          {SPLIT_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleSplitTypeChange(tab.value)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                splitType === tab.value
                  ? "bg-[#5bc5a7] text-white border-[#5bc5a7]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Percent warning */}
      {splitType === "percent" && Math.abs(percentTotal - 100) > 0.01 && (
        <div className={`mx-4 mt-3 px-3 py-2 rounded-lg text-xs font-medium ${
          percentTotal > 100 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
        }`}>
          {percentTotal > 100
            ? `Over by ${(percentTotal - 100).toFixed(1)}% — total is ${percentTotal.toFixed(1)}%`
            : `${(100 - percentTotal).toFixed(1)}% unassigned — total is ${percentTotal.toFixed(1)}%`}
        </div>
      )}

      {/* Absolute warning */}
      {splitType === "absolute" && Math.abs(absoluteTotal - total) > 0.01 && total > 0 && (
        <div className={`mx-4 mt-3 px-3 py-2 rounded-lg text-xs font-medium ${
          absoluteTotal > total ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
        }`}>
          {absoluteTotal > total
            ? `$${(absoluteTotal - total).toFixed(2)} over total`
            : `$${(total - absoluteTotal).toFixed(2)} remaining to assign`}
        </div>
      )}

      {/* Members table */}
      <div className="flex-1 px-4 pt-4">
        {/* Table header */}
        <div className={`grid ${showValueColumn ? "grid-cols-[1fr_80px_80px]" : "grid-cols-[1fr_80px]"} gap-2 pb-2 border-b border-gray-100`}>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Name</span>
          {showValueColumn && (
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide text-center">{valueColumnLabel}</span>
          )}
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide text-right">Owes</span>
        </div>

        {/* Member rows */}
        <div className="divide-y divide-gray-50">
          {calculated.map((member) => (
            <div
              key={member.id}
              className={`grid ${showValueColumn ? "grid-cols-[1fr_80px_80px]" : "grid-cols-[1fr_80px]"} gap-2 py-3 items-center`}
            >
              <MemberAvatar name={member.name} isYou={member.isYou} />

              {showValueColumn && (
                <div className="flex justify-center">
                  <input
                    type="number"
                    value={members.find((m) => m.id === member.id)?.value ?? ""}
                    onChange={(e) => handleValueChange(member.id, e.target.value)}
                    min="0"
                    step={splitType === "share" ? "1" : "0.01"}
                    className="w-16 text-center text-sm border border-gray-200 rounded-lg py-1.5 outline-none focus:border-[#5bc5a7] focus:ring-1 focus:ring-[#5bc5a7]"
                  />
                </div>
              )}

              <div className="text-right">
                <span className={`text-sm font-semibold ${member.amount > 0 ? "text-gray-800" : "text-gray-300"}`}>
                  ${member.amount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Total check row */}
        <div className={`grid ${showValueColumn ? "grid-cols-[1fr_80px_80px]" : "grid-cols-[1fr_80px]"} gap-2 pt-3 mt-1 border-t border-gray-200`}>
          <span className="text-xs text-gray-500 font-medium">Total</span>
          {showValueColumn && (
            <span className="text-xs text-gray-500 text-center font-medium">
              {splitType === "percent" ? `${percentTotal.toFixed(1)}%` : ""}
            </span>
          )}
          <span className="text-xs text-right font-semibold text-gray-700">
            ${calculated.reduce((s, m) => s + m.amount, 0).toFixed(2)}
          </span>
        </div>
      </div>
      <AiPromptBox />
    </div>
  );
}
