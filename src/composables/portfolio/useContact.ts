import { useEffect, useRef, useState } from "react";
import { email } from "@/components/portfolio/content";
import type { ContactActions } from "@/components/portfolio/types";

export const useContact = (): { contact: ContactActions } => {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyEmail = async () => {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    timer.current = setTimeout(() => setStatus("idle"), 3500);
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return { contact: { status, copyEmail } };
};
