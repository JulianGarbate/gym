"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";

export default function SubmitButton({
  children,
  pendingChildren,
  doneChildren,
  showDoneFlash = false,
  className,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  pendingChildren?: React.ReactNode;
  doneChildren?: React.ReactNode;
  showDoneFlash?: boolean;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    if (wasPending.current && !pending && showDoneFlash) {
      setShowDone(true);
      const t = setTimeout(() => setShowDone(false), 1500);
      return () => clearTimeout(t);
    }
    wasPending.current = pending;
  }, [pending, showDoneFlash]);

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-label={ariaLabel}
      aria-busy={pending}
      className={className}
    >
      {pending
        ? (pendingChildren ?? <Loader2 size={16} className="animate-spin" />)
        : showDone
          ? (doneChildren ?? <Check size={16} />)
          : children}
    </button>
  );
}
