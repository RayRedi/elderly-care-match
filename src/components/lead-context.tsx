"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { careTypes } from "@/lib/site";

export type CareType = (typeof careTypes)[number]["id"];

type LeadContextValue = {
  careType: CareType | "";
  setCareType: (careType: CareType | "") => void;
  selectCareType: (careType: CareType) => void;
};

const LeadContext = createContext<LeadContextValue | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [careType, setCareType] = useState<CareType | "">("");

  function selectCareType(next: CareType) {
    setCareType(next);
    window.requestAnimationFrame(() => {
      document.getElementById("get-help")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <LeadContext.Provider value={{ careType, setCareType, selectCareType }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeadSelection() {
  const value = useContext(LeadContext);
  if (!value) {
    throw new Error("useLeadSelection must be used inside LeadProvider");
  }
  return value;
}
