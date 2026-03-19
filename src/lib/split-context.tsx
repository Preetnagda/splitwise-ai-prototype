"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useExpense, GROUP_MEMBERS, SplitType } from "./expense-context";

export interface MemberSplit {
  id: string;
  name: string;
  isYou?: boolean;
  value: string;
  amount: number;
}

function calcSplits(
  totalStr: string,
  splitType: SplitType,
  members: MemberSplit[]
): MemberSplit[] {
  const total = parseFloat(totalStr) || 0;

  if (splitType === "equal") {
    const active = members.filter((m) => parseFloat(m.value) !== 0);
    const each = active.length > 0 ? total / active.length : 0;
    return members.map((m) => ({
      ...m,
      value: parseFloat(m.value) === 0 ? "0" : "1",
      amount: parseFloat(m.value) === 0 ? 0 : each,
    }));
  }

  if (splitType === "share") {
    const totalShares = members.reduce((sum, m) => sum + (parseFloat(m.value) || 0), 0);
    return members.map((m) => {
      const shares = parseFloat(m.value) || 0;
      return { ...m, amount: totalShares > 0 ? (shares / totalShares) * total : 0 };
    });
  }

  if (splitType === "percent") {
    return members.map((m) => {
      const pct = parseFloat(m.value) || 0;
      return { ...m, amount: (pct / 100) * total };
    });
  }

  // absolute
  return members.map((m) => ({ ...m, amount: parseFloat(m.value) || 0 }));
}

function defaultValue(splitType: SplitType): string {
  return splitType === "percent"
    ? String((100 / GROUP_MEMBERS.length).toFixed(1))
    : "1";
}

interface SplitContextValue {
  splitType: SplitType;
  members: MemberSplit[];
  calculated: MemberSplit[];
  total: number;
  percentTotal: number;
  absoluteTotal: number;
  showValueColumn: boolean;
  valueColumnLabel: string;
  handleSplitTypeChange: (type: SplitType) => void;
  handleValueChange: (id: string, val: string) => void;
  applyAiResult: (splitType: SplitType, memberValues: { id: string; value: string }[]) => void;
}

const SplitContext = createContext<SplitContextValue | null>(null);

export function SplitProvider({ children }: { children: ReactNode }) {
  const { expense } = useExpense();

  const [splitType, setSplitType] = useState<SplitType>(expense.splitType);
  const [members, setMembers] = useState<MemberSplit[]>(() =>
    GROUP_MEMBERS.map((m) => ({
      ...m,
      value: defaultValue(expense.splitType),
      amount: 0,
    }))
  );

  const calculated = calcSplits(expense.amount, splitType, members);
  const total = parseFloat(expense.amount) || 0;

  const percentTotal =
    splitType === "percent"
      ? members.reduce((sum, m) => sum + (parseFloat(m.value) || 0), 0)
      : 0;

  const absoluteTotal =
    splitType === "absolute"
      ? members.reduce((sum, m) => sum + (parseFloat(m.value) || 0), 0)
      : 0;

  const showValueColumn = splitType !== "equal";
  const valueColumnLabel =
    splitType === "share" ? "Shares" :
    splitType === "percent" ? "%" :
    splitType === "absolute" ? "Amount" : "";

  function handleSplitTypeChange(type: SplitType) {
    setSplitType(type);
    setMembers((prev) => prev.map((m) => ({ ...m, value: defaultValue(type) })));
  }

  function handleValueChange(id: string, val: string) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, value: val } : m)));
  }

  function applyAiResult(
    newSplitType: SplitType,
    memberValues: { id: string; value: string }[]
  ) {
    setSplitType(newSplitType);
    setMembers((prev) =>
      prev.map((m) => {
        const mv = memberValues.find((v) => v.id === m.id);
        return mv ? { ...m, value: mv.value } : m;
      })
    );
  }

  return (
    <SplitContext.Provider
      value={{
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
        applyAiResult,
      }}
    >
      {children}
    </SplitContext.Provider>
  );
}

export function useSplit() {
  const ctx = useContext(SplitContext);
  if (!ctx) throw new Error("useSplit must be used within SplitProvider");
  return ctx;
}
