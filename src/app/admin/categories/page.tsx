"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import { categories } from "@/lib/api";
import { slugify } from "@/lib/utils";
import type { Category, CreateCategoryDto } from "@/types";

const empty: CreateCategoryDto = { name: "", slug: "" };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateCategoryDto>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await categories.getAll();
      setItems(data);
    } catch {
      toast.error("ไม่สามารถโหลดหมวดหมู่ได้");
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

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await categories.update(editingId, form);
        toast.success("อัปเดตหมวดหมู่สำเร็จ");
      } else {
        await categories.create(form);
        toast.success("สร้างหมวดหมู่สำเร็จ");
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
    if (!confirm(`ต้องการลบหมวดหมู่ "${name}" หรือไม่?`)) return;
    try {
      await categories.delete(id);
      toast.success("ลบหมวดหมู่สำเร็จ");
      setItems((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">หมวดหมู่</h1>
          <p className="mt-1 text-sm text-gray-500">
            จัดการหมวดหมู่ทั้งหมด ({items.length})
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
            เพิ่มหมวดหมู่
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            {editingId ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">ชื่อหมวดหมู่</label>
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
                placeholder="เช่น Technology"
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
                placeholder="technology"
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
            <p className="text-gray-500">ยังไม่มีหมวดหมู่</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3.5 font-semibold text-gray-600">
                    ชื่อ
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600">
                    Slug
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600">
                    จำนวน Posts
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600 text-right">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-500">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {cat._count?.posts ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(cat)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                          title="แก้ไข"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="ลบ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
