"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export interface AdminDraftInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string | number;
  onCommit: (val: string) => void;
  debounceMs?: number;
}

export const AdminDraftInput = React.memo(function AdminDraftInput({
  value,
  onCommit,
  onBlur,
  onKeyDown,
  onFocus,
  debounceMs = 500,
  className,
  ...props
}: AdminDraftInputProps) {
  const [localValue, setLocalValue] = useState<string>(value !== undefined && value !== null ? String(value) : "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFocusedRef = useRef(false);
  const latestLocalRef = useRef(localValue);
  latestLocalRef.current = localValue;
  const committedValueRef = useRef<string>(value !== undefined && value !== null ? String(value) : "");

  // Synchronize when external prop changes, but only if not actively focused
  useEffect(() => {
    const stringified = value !== undefined && value !== null ? String(value) : "";
    committedValueRef.current = stringified;
    if (!isFocusedRef.current) {
      setLocalValue(stringified);
    }
  }, [value]);

  const commit = useCallback(
    (valToCommit: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (valToCommit !== committedValueRef.current) {
        committedValueRef.current = valToCommit;
        onCommit(valToCommit);
      }
    },
    [onCommit]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setLocalValue(nextVal);

    if (debounceMs > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        commit(nextVal);
      }, debounceMs);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = false;
    commit(latestLocalRef.current);
    onBlur?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commit(latestLocalRef.current);
    }
    onKeyDown?.(e);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <input
      {...props}
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
});

export interface AdminDraftTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
  value?: string;
  onCommit: (val: string) => void;
  debounceMs?: number;
}

export const AdminDraftTextarea = React.memo(function AdminDraftTextarea({
  value,
  onCommit,
  onBlur,
  onFocus,
  debounceMs = 500,
  className,
  ...props
}: AdminDraftTextareaProps) {
  const [localValue, setLocalValue] = useState<string>(value || "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFocusedRef = useRef(false);
  const latestLocalRef = useRef(localValue);
  latestLocalRef.current = localValue;
  const committedValueRef = useRef<string>(value || "");

  useEffect(() => {
    const stringified = value || "";
    committedValueRef.current = stringified;
    if (!isFocusedRef.current) {
      setLocalValue(stringified);
    }
  }, [value]);

  const commit = useCallback(
    (valToCommit: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (valToCommit !== committedValueRef.current) {
        committedValueRef.current = valToCommit;
        onCommit(valToCommit);
      }
    },
    [onCommit]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    setLocalValue(nextVal);

    if (debounceMs > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        commit(nextVal);
      }, debounceMs);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    isFocusedRef.current = true;
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    isFocusedRef.current = false;
    commit(latestLocalRef.current);
    onBlur?.(e);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <textarea
      {...props}
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
});

