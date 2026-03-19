"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useExpense, GROUP_MEMBERS } from "@/lib/expense-context";
import { PageHeader } from "@/components/PageHeader";
import { GroupIcon } from "@/components/image/GroupIcon";
import { DocumentIcon } from "@/components/image/DocumentIcon";
import { CalendarIcon } from "@/components/image/CalendarIcon";
import { CameraIcon } from "@/components/image/CameraIcon";
import { EditIcon } from "@/components/image/EditIcon";

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
      <PageHeader
        onLeft={() => router.back()}
        leftIcon="close"
        title="Add an expense"
        onSave={handleSave}
      />

      {/* Group context */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">
            With <span className="font-bold text-gray-800">you</span> and:
          </span>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center">
              <GroupIcon width={16} height={16} fill="white" stroke="none" />
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
          <div className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center shrink-0 bg-white shadow-sm">
            <DocumentIcon />
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
          <div className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center shrink-0 bg-white shadow-sm">
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
          <CalendarIcon />
          Today
        </button>

        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <GroupIcon width={18} height={18} stroke="#e8783d" />
          <span className="text-[#e8783d]">{groupName}</span>
        </button>

        <button className="text-gray-400 hover:text-gray-600">
          <CameraIcon />
        </button>

        <button className="text-gray-400 hover:text-gray-600">
          <EditIcon stroke="#5bc5a7" />
        </button>
      </div>
    </div>
  );
}
