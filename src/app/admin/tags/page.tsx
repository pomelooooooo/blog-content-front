"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import { tags } from "@/lib/api";
import { slugify } from "@/lib/utils";
import type { Tag, CreateTagDto } from "@/types";

const empty: CreateTagDto = { name: "", slug: "" };

export default function TagsPage() {
  const [items, setItems] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateTagDto>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await tags.getAll();
      setItems(data);
    } catch {
      toast.error("ไม่สามารถโหลดแท็กได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(empty);
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setForm({ name: tag.name, slug: tag.slug });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await tags.update(editingId, form);
        toast.success("อัปเดตแท็กสำเร็จ");
      } else {
        await tags.create(form);
        toast.success("สร้างแท็กสำเร็จ");
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`ต้องการลบแท็ก "${name}" หรือไม่?`)) return;
    try {
      await tags.delete(id);
      toast.success("ลบแท็กสำเร็จ");
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">แท็ก</h1>
          <p className="mt-1 text-sm text-gray-500">
            จัดการแท็กทั้งหมด ({items.length})
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            เพิ่มแท็ก
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            {editingId ? "แก้ไขแท็ก" : "เพิ่มแท็กใหม่"}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">ชื่อแท็ก</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    name: e.target.value,
                    slug: editingId ? form.slug : slugify(e.target.value),
                  })
                }
                placeholder="เช่น NestJS"
                className="input"
                autoFocus
              />
            </div>
            <div>
              <label className="label">Slug</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="nestjs"
                className="input font-mono text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {editingId ? "บันทึก" : "สร้าง"}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              <X className="h-4 w-4" />
              ยกเลิก
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">ยังไม่มีแท็ก</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 p-6">
            {items.map((tag) => (
              <div
                key={tag.id}
                className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition hover:shadow-md"
              >
                <span className="font-medium text-gray-900">{tag.name}</span>
                <span className="text-xs text-gray-400 font-mono">
                  ({tag.slug})
                </span>
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {tag._count?.posts ?? 0} posts
                </span>
                <div className="ml-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => startEdit(tag)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id, tag.name)}
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
