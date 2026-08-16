"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as svc from "@/services/sections.service";
import * as hallsSvc from "@/services/halls.service";
import type { Section, CreateSection } from "@/dto/section.dto";
import type { Hall } from "@/dto/hall.dto";
import { CrudTable, Modal, Field, inputCls, ConfirmDelete } from "./crud-ui";

const empty = (): CreateSection => ({ name: "", hallId: "", additionPrice: 0, rows: 0, columns: 0 });

export default function SectionsTab() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<Section[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateSection>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!accessToken) return;
    setLoading(true);
    try { 
      const [secs, hls] = await Promise.all([svc.getSections(accessToken), hallsSvc.getHalls(accessToken)]);
      setItems(secs);
      setHalls(hls);
      setError(null); 
    }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [accessToken]);

  function openAdd() { setForm(empty()); setEditId(null); setShowModal(true); }
  function openEdit(i: number) { const s = items[i]; setForm({ name: s.name, hallId: s.hallId, additionPrice: Number(s.additionPrice), rows: s.rows, columns: s.columns }); setEditId(s.id); setShowModal(true); }

  async function handleSave() {
    if (!accessToken) return;
    setSaving(true);
    try {
      if (editId) await svc.updateSection(accessToken, editId, form);
      else await svc.createSection(accessToken, form);
      setShowModal(false); await load();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setSaving(true);
    try { await svc.deleteSection(accessToken, deleteId); setDeleteId(null); await load(); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  const set = (k: keyof CreateSection) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: ["additionPrice", "rows", "columns"].includes(k) ? Number(e.target.value) : e.target.value }));

  return (
    <>
      <CrudTable
        label="Sections"
        onAdd={openAdd}
        isLoading={loading}
        error={error}
        headers={["Name", "Hall", "Addition Price", "Rows", "Columns"]}
        rows={items.map((s) => [s.name, halls.find(h => h.id === s.hallId)?.name || s.hallId, `$${s.additionPrice}`, String(s.rows), String(s.columns)])}
        onEdit={openEdit}
        onDelete={(i) => setDeleteId(items[i].id)}
      />

      {showModal && (
        <Modal title={editId ? "Edit Section" : "Add Section"} onClose={() => setShowModal(false)} onSubmit={handleSave} isLoading={saving}>
          <Field label="Name"><input className={inputCls} value={form.name} onChange={set("name")} placeholder="VIP" /></Field>
          <Field label="Hall">
            <select className={inputCls} value={form.hallId} onChange={set("hallId")}>
              <option value="">Select Hall...</option>
              {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </Field>
          <Field label="Addition Price"><input type="number" step="0.01" className={inputCls} value={form.additionPrice} onChange={set("additionPrice")} /></Field>
          <Field label="Rows"><input type="number" className={inputCls} value={form.rows} onChange={set("rows")} /></Field>
          <Field label="Columns"><input type="number" className={inputCls} value={form.columns} onChange={set("columns")} /></Field>
        </Modal>
      )}

      {deleteId && <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={saving} />}
    </>
  );
}
