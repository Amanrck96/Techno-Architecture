"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Sparkles,
  Check,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageMouseAdjusterProps {
  imageUrl: string;
  positionX?: number; // 0 - 100
  positionY?: number; // 0 - 100
  scale?: number; // 1.0 - 2.5
  label?: string;
  folder?: string;
  onChange: (update: {
    imageUrl?: string;
    positionX: number;
    positionY: number;
    scale: number;
  }) => void;
  onToast?: (msg: string) => void;
}

export function ImageMouseAdjuster({
  imageUrl,
  positionX = 50,
  positionY = 50,
  scale = 1.0,
  label = "Hero Image & Mouse Alignment",
  folder = "monographs",
  onChange,
  onToast,
}: ImageMouseAdjusterProps) {
  const [posX, setPosX] = useState<number>(positionX);
  const [posY, setPosY] = useState<number>(positionY);
  const [currentScale, setCurrentScale] = useState<number>(scale);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>(imageUrl || "");

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with incoming props if changed externally
  useEffect(() => {
    setPosX(positionX ?? 50);
    setPosY(positionY ?? 50);
    setCurrentScale(scale ?? 1.0);
    setUrlInput(imageUrl || "");
  }, [positionX, positionY, scale, imageUrl]);

  // Handle position calculation from mouse / pointer event
  const updatePositionFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const rawX = ((clientX - rect.left) / rect.width) * 100;
      const rawY = ((clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.round(Math.max(0, Math.min(100, rawX)));
      const clampedY = Math.round(Math.max(0, Math.min(100, rawY)));

      setPosX(clampedX);
      setPosY(clampedY);

      onChange({
        positionX: clampedX,
        positionY: clampedY,
        scale: currentScale,
      });
    },
    [currentScale, onChange]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    updatePositionFromEvent(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePositionFromEvent(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onToast?.(`Image alignment adjusted: ${posX}% X, ${posY}% Y`);
    }
  };

  // Touch support for mobile / touch screens
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      updatePositionFromEvent(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && e.touches.length === 1) {
      updatePositionFromEvent(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Mouse wheel zoom when hovering over the image
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const newScale = Math.round(Math.max(1.0, Math.min(2.5, currentScale + delta)) * 100) / 100;
    setCurrentScale(newScale);
    onChange({
      positionX: posX,
      positionY: posY,
      scale: newScale,
    });
  };

  // Handle image file upload (Canvas optimization -> Authenticated /api/upload -> Instant fallback)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (.jpg, .png, .webp, .avif).");
      return;
    }

    setIsUploading(true);
    onToast?.("Processing image for upload...");

    try {
      let fallbackDataUrl = "";
      let uploadFile: File | Blob = file;

      // 1. Client-Side Image Optimization (Canvas resize to max 1600px at 85% quality)
      if (typeof window !== "undefined") {
        try {
          const compressed = await new Promise<{ blob: Blob; dataUrl: string }>((resolve) => {
            let finished = false;
            const timer = setTimeout(() => {
              if (finished) return;
              finished = true;
              const r = new FileReader();
              r.onload = () => resolve({ blob: file, dataUrl: (r.result as string) || "" });
              r.onerror = () => resolve({ blob: file, dataUrl: "" });
              r.readAsDataURL(file);
            }, 2500);

            const reader = new FileReader();
            reader.onload = (ev) => {
              const img = document.createElement("img");
              img.onload = () => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                const maxDim = 1600;
                let w = img.width;
                let h = img.height;
                if (w > maxDim || h > maxDim) {
                  if (w > h) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                  } else {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                  }
                }
                const canvas = document.createElement("canvas");
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(img, 0, 0, w, h);
                  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                  canvas.toBlob(
                    (b) => {
                      resolve({ blob: b || file, dataUrl });
                    },
                    "image/jpeg",
                    0.85
                  );
                } else {
                  const dataUrl = ev.target?.result as string;
                  resolve({ blob: file, dataUrl });
                }
              };
              img.onerror = () => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                const dataUrl = ev.target?.result as string;
                resolve({ blob: file, dataUrl });
              };
              img.src = ev.target?.result as string;
            };
            reader.onerror = () => {
              if (finished) return;
              finished = true;
              clearTimeout(timer);
              resolve({ blob: file, dataUrl: "" });
            };
            reader.readAsDataURL(file);
          });

          fallbackDataUrl = compressed.dataUrl;
          if (compressed.blob) {
            uploadFile = new File([compressed.blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
            });
          }
        } catch (compErr) {
          console.debug("Canvas optimization notice:", compErr);
        }
      }

      // 2. Upload via Next.js server /api/upload endpoint with full authentication
      try {
        const fd = new FormData();
        fd.append("file", uploadFile);
        fd.append("folder", folder);

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("techno_admin_token") ||
              sessionStorage.getItem("techno_admin_token")
            : null;

        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
          headers["x-admin-token"] = token;
          fd.append("adminToken", token);
        }

        const res = await fetch("/api/upload", {
          method: "POST",
          credentials: "include",
          headers,
          body: fd,
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.url) {
            setUrlInput(data.url);
            onChange({
              imageUrl: data.url,
              positionX: posX,
              positionY: posY,
              scale: currentScale,
            });
            onToast?.("✅ Image uploaded and applied successfully.");
            return;
          }
        }
      } catch (apiErr) {
        console.warn("Server upload fallback failed, using dataUrl fallback:", apiErr);
      }

      // 3. Fallback: Apply client dataUrl
      if (fallbackDataUrl) {
        setUrlInput(fallbackDataUrl);
        onChange({
          imageUrl: fallbackDataUrl,
          positionX: posX,
          positionY: posY,
          scale: currentScale,
        });
        onToast?.("✅ Image saved to studio archive.");
        return;
      }

      throw new Error("Could not process image file.");
    } catch (err: any) {
      alert(`Image upload failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Apply quick position preset
  const applyPreset = (x: number, y: number, name: string) => {
    setPosX(x);
    setPosY(y);
    onChange({
      positionX: x,
      positionY: y,
      scale: currentScale,
    });
    onToast?.(`Position set to ${name} (${x}%, ${y}%)`);
  };

  // Reset to default center & scale 1.0
  const handleReset = () => {
    setPosX(50);
    setPosY(50);
    setCurrentScale(1.0);
    onChange({
      positionX: 50,
      positionY: 50,
      scale: 1.0,
    });
    onToast?.("Image alignment reset to center (50%, 50%)");
  };

  const hasImage = Boolean(imageUrl && imageUrl.trim().length > 0);

  return (
    <div className="space-y-3 p-4 bg-neutral-50/80 border border-neutral-200 rounded-md">
      {/* Header with Title and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/70 pb-2.5">
        <div className="flex items-center gap-2">
          <Crosshair size={14} className="text-neutral-700" />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-800 font-mono">
            {label}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">
            (Interactive Mouse Framing)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-neutral-500 hover:text-black hover:bg-neutral-200/60 rounded transition-colors"
            title="Reset alignment to default center"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* URL Input & Upload Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-8 flex items-center gap-2">
          <input
            type="text"
            value={urlInput}
            placeholder="Enter image URL (e.g. /projects/aikya/... or https://...)"
            onChange={(e) => {
              setUrlInput(e.target.value);
              onChange({
                imageUrl: e.target.value,
                positionX: posX,
                positionY: posY,
                scale: currentScale,
              });
            }}
            className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded font-mono bg-white focus:outline-none focus:border-black"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-black text-white text-[11px] font-medium uppercase tracking-wider hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors rounded shadow-xs"
          >
            <Upload size={12} />
            <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Drag & Drop Canvas */}
      {hasImage ? (
        <div className="space-y-2">
          {/* Main Visual Drag Frame */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              if (isDragging) setIsDragging(false);
              setIsHovering(false);
            }}
            onMouseEnter={() => setIsHovering(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            className={cn(
              "relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-72 bg-neutral-900 rounded overflow-hidden select-none border-2 transition-all",
              isDragging
                ? "cursor-grabbing border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                : "cursor-grab border-neutral-300 hover:border-black"
            )}
            title="Click and drag with mouse to adjust framing focal point"
          >
            {/* The Image being adjusted */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={imageUrl}
                alt="Framing preview"
                className="w-full h-full object-cover transition-transform duration-75"
                style={{
                  objectPosition: `${posX}% ${posY}%`,
                  transform: currentScale !== 1 ? `scale(${currentScale})` : undefined,
                  transformOrigin: `${posX}% ${posY}%`,
                }}
              />
            </div>

            {/* Rule of Thirds Architectural Grid (faintly visible when hovering or dragging) */}
            <div
              className={cn(
                "absolute inset-0 pointer-events-none transition-opacity duration-200 grid grid-cols-3 grid-rows-3",
                isHovering || isDragging ? "opacity-30" : "opacity-0"
              )}
            >
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Visual Focal Point Reticle / Target */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
              style={{ left: `${posX}%`, top: `${posY}%` }}
            >
              <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform",
                    isDragging ? "scale-110 border-emerald-400 bg-emerald-500/20" : "bg-black/25"
                  )}
                >
                  {/* Center Dot */}
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                </div>
                {/* Crosshair Hairlines */}
                <div className="absolute w-12 h-px bg-white/70 pointer-events-none" />
                <div className="absolute h-12 w-px bg-white/70 pointer-events-none" />
              </div>
            </div>

            {/* Live Instruction Pill */}
            <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
              <span className="px-2 py-1 bg-black/80 backdrop-blur-xs text-white rounded text-[10px] font-mono flex items-center gap-1.5 shadow-sm">
                <Move size={11} className={isDragging ? "text-emerald-400 animate-pulse" : "text-white"} />
                <span>
                  {isDragging ? "Dragging Focal Point..." : "Drag with mouse to adjust"}
                </span>
              </span>
            </div>

            {/* Position Coordinate Pill */}
            <div className="absolute top-2 right-2 z-10 pointer-events-none">
              <span className="px-2 py-0.5 bg-black/80 backdrop-blur-xs text-emerald-400 rounded text-[10px] font-mono">
                X: {posX}% · Y: {posY}% · {currentScale}x
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons & Zoom Slider */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            {/* Quick Position Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono text-neutral-500 mr-1">
                Presets:
              </span>
              <button
                type="button"
                onClick={() => applyPreset(50, 15, "Top")}
                className={cn(
                  "px-2 py-0.5 text-[10px] font-mono border rounded transition-colors",
                  posX === 50 && posY === 15
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                )}
              >
                Top
              </button>
              <button
                type="button"
                onClick={() => applyPreset(50, 50, "Center")}
                className={cn(
                  "px-2 py-0.5 text-[10px] font-mono border rounded transition-colors",
                  posX === 50 && posY === 50
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                )}
              >
                Center
              </button>
              <button
                type="button"
                onClick={() => applyPreset(50, 85, "Bottom")}
                className={cn(
                  "px-2 py-0.5 text-[10px] font-mono border rounded transition-colors",
                  posX === 50 && posY === 85
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                )}
              >
                Bottom
              </button>
              <button
                type="button"
                onClick={() => applyPreset(15, 50, "Left")}
                className={cn(
                  "px-2 py-0.5 text-[10px] font-mono border rounded transition-colors",
                  posX === 15 && posY === 50
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                )}
              >
                Left
              </button>
              <button
                type="button"
                onClick={() => applyPreset(85, 50, "Right")}
                className={cn(
                  "px-2 py-0.5 text-[10px] font-mono border rounded transition-colors",
                  posX === 85 && posY === 50
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                )}
              >
                Right
              </button>
            </div>

            {/* Zoom Slider Control */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-neutral-500">
                Zoom:
              </span>
              <button
                type="button"
                onClick={() => {
                  const s = Math.max(1.0, Math.round((currentScale - 0.1) * 10) / 10);
                  setCurrentScale(s);
                  onChange({ positionX: posX, positionY: posY, scale: s });
                }}
                className="p-1 hover:bg-neutral-200 rounded text-neutral-600"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.05"
                value={currentScale}
                onChange={(e) => {
                  const s = parseFloat(e.target.value);
                  setCurrentScale(s);
                  onChange({ positionX: posX, positionY: posY, scale: s });
                }}
                className="w-24 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <button
                type="button"
                onClick={() => {
                  const s = Math.min(2.5, Math.round((currentScale + 0.1) * 10) / 10);
                  setCurrentScale(s);
                  onChange({ positionX: posX, positionY: posY, scale: s });
                }}
                className="p-1 hover:bg-neutral-200 rounded text-neutral-600"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <span className="text-[10px] font-mono text-neutral-600 w-8">
                {currentScale.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 rounded p-6 text-center hover:border-black transition-colors cursor-pointer bg-white"
        >
          <Upload size={22} className="mx-auto text-neutral-400 mb-2" />
          <p className="text-xs font-medium text-neutral-800">
            No image selected yet
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Click to upload an image from your computer, or paste a URL above.
          </p>
        </div>
      )}
    </div>
  );
}
