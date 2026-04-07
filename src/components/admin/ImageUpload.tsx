"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Props {
  value?: string | null;
  onChange: (url: string | null) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      onChange(data.url);
      toast.success("อัปโหลดรูปภาพสำเร็จ");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "อัปโหลดรูปภาพไม่สำเร็จ"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={value}
            alt="Cover"
            width={800}
            height={400}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-white"
            >
              เปลี่ยนรูป
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-lg bg-red-500/90 p-1.5 text-white hover:bg-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition hover:border-primary-400 hover:bg-primary-50/50"
        >
          {uploading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          ) : (
            <>
              <div className="mb-3 rounded-full bg-gray-100 p-3">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                คลิกหรือลากรูปภาพมาวาง
              </p>
              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG, GIF, WebP (สูงสุด 5MB)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />

      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-400">หรือ</span>
        <input
          type="text"
          placeholder="วาง URL รูปภาพ..."
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          className="input flex-1 text-xs"
        />
      </div>
    </div>
  );
}
