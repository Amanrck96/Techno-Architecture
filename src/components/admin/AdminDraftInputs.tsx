"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export interface AdminDraftInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string | number;
  onCommit: (val: string) => void;
  debounceMs?: number; // Kept for interface compatibility; commits strictly on blur / Enter
}

/**
 * High-performance draft text input.
 * Keeps changes in LOCAL component state while typing.
 * Commits to the parent store ONLY on blur or when the Enter key is pressed.
 * Prevents unnecessary re-renders of the entire admin page on every keystroke.
 */
export const AdminDraftInput = React.memo(function AdminDraftInput({
  value,
  onCommit,
  onBlur,
  onKeyDown,
  onFocus,
  className,
  ...props
}: AdminDraftInputProps) {
  const [localValue, setLocalValue] = useState<string>(
    value !== undefined && value !== null ? String(value) : ""
  );
  const isFocusedRef = useRef(false);
  const committedValueRef = useRef<string>(
    value !== undefined && value !== null ? String(value) : ""
  );
  const latestLocalRef = useRef(localValue);
  latestLocalRef.current = localValue;

  // Sync external value only if the user is not actively typing/focused
  useEffect(() => {
    const stringified = value !== undefined && value !== null ? String(value) : "";
    committedValueRef.current = stringified;
    if (!isFocusedRef.current) {
      setLocalValue(stringified);
    }
  }, [value]);

  const commit = useCallback(
    (valToCommit: string) => {
      if (valToCommit !== committedValueRef.current) {
        committedValueRef.current = valToCommit;
        onCommit(valToCommit);
      }
    },
    [onCommit]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
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
  value?: string | number;
  onCommit: (val: string) => void;
  debounceMs?: number;
}

/**
 * High-performance draft textarea.
 * Keeps changes in LOCAL component state while typing.
 * Commits to the parent store ONLY on blur.
 */
export const AdminDraftTextarea = React.memo(function AdminDraftTextarea({
  value,
  onCommit,
  onBlur,
  onFocus,
  className,
  ...props
}: AdminDraftTextareaProps) {
  const [localValue, setLocalValue] = useState<string>(
    value !== undefined && value !== null ? String(value) : ""
  );
  const isFocusedRef = useRef(false);
  const committedValueRef = useRef<string>(
    value !== undefined && value !== null ? String(value) : ""
  );
  const latestLocalRef = useRef(localValue);
  latestLocalRef.current = localValue;

  useEffect(() => {
    const stringified = value !== undefined && value !== null ? String(value) : "";
    committedValueRef.current = stringified;
    if (!isFocusedRef.current) {
      setLocalValue(stringified);
    }
  }, [value]);

  const commit = useCallback(
    (valToCommit: string) => {
      if (valToCommit !== committedValueRef.current) {
        committedValueRef.current = valToCommit;
        onCommit(valToCommit);
      }
    },
    [onCommit]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
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

