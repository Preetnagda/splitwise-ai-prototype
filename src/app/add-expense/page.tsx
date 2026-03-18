"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useExpense, GROUP_MEMBERS } from "@/lib/expense-context";

export default function AddExpensePage() {
  const router = useRouter();
  const { expense, setExpense } = useExpense();
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount);

  const groupName = "Trip Group";
  const otherMembers = GROUP_MEMBERS.filter((m) => !m.isYou);

  function handleSave() {
    setExpense({ ...expense, description, amount });
    toast.success("Expense saved successfully!");
  }

  function handleSplitEqually() {
    setExpense({ ...expense, description, amount, splitType: "equal" });
    router.push("/split");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <button className="text-gray-500 hover:text-gray-700 p-1">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-800">Add an expense</h1>
        <button
          onClick={handleSave}
          className="text-[#5bc5a7] font-semibold text-base hover:text-[#4aad91]"
        >
          Save
        </button>
      </div>

      {/* Group context */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">
            With <span className="font-bold text-gray-800">you</span> and:
          </span>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-800">
              All of {groupName}
            </span>
          </div>
        </div>
        {/* Member avatars */}
        <div className="flex items-center gap-2 mt-2 ml-1">
          {GROUP_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center gap-0.5"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
                {member.name[0]}
              </div>
              <span className="text-[10px] text-gray-500">
                {member.isYou ? "You" : member.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 pt-6 pb-4 flex flex-col gap-6">
        {/* Description */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description"
              className="w-full text-base text-gray-700 placeholder-gray-400 border-b-2 border-[#5bc5a7] outline-none pb-1 bg-transparent"
            />
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
            <span className="text-xl font-semibold text-gray-600">$</span>
          </div>
          <div className="flex-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full text-2xl font-light text-gray-400 placeholder-gray-300 border-b border-gray-300 outline-none pb-1 bg-transparent focus:border-gray-500"
            />
          </div>
        </div>

        {/* Split button */}
        <div className="flex justify-center mt-2">
          <button
            onClick={handleSplitEqually}
            className="border border-gray-300 rounded-full px-6 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Paid by <span className="font-semibold">you</span> and split equally
          </button>
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Today
        </button>

        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8783d" strokeWidth="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-[#e8783d]">{groupName}</span>
        </button>

        <button className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>

        <button className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5bc5a7" strokeWidth="1.8">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
