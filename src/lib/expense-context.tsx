"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type SplitType = "equal" | "percent" | "share" | "absolute";

export interface Member {
  id: string;
  name: string;
  isYou?: boolean;
}

export const GROUP_MEMBERS: Member[] = [
  { id: "1", name: "You", isYou: true },
  { id: "2", name: "Alex" },
  { id: "3", name: "Sarah" },
  { id: "4", name: "Mike" },
];

export interface ExpenseState {
  description: string;
  amount: string;
  splitType: SplitType;
}

interface ExpenseContextValue {
  expense: ExpenseState;
  setExpense: (expense: ExpenseState) => void;
}

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expense, setExpense] = useState<ExpenseState>({
    description: "",
    amount: "",
    splitType: "equal",
  });

  return (
    <ExpenseContext.Provider value={{ expense, setExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpense must be used within ExpenseProvider");
  return ctx;
}
