"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as svc from "@/services/halls.service";
import type { Hall, CreateHall } from "@/dto/hall.dto";
import { CrudTable, Modal, Field, inputCls, ConfirmDelete } from "./crud-ui";

const empty = (): CreateHall => ({ name: "", description: "", capacity: 0 });

export default function HallsTab() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateHall>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!accessToken) return;
    setLoading(true);
    try { setItems(await svc.getHalls(accessToken)); setError(null); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [accessToken]);

  function openAdd() { setForm(empty()); setEditId(null); setShowModal(true); }
  function openEdit(i: number) { const h = items[i]; setForm({ name: h.name, description: h.description, capacity: h.capacity }); setEditId(h.id); setShowModal(true); }

  async function handleSave() {
    if (!accessToken) return;
    setSaving(true);
    try {
      if (editId) await svc.updateHall(accessToken, editId, form);
      else await svc.createHall(accessToken, form);
      setShowModal(false); await load();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setSaving(true);
    try { await svc.deleteHall(accessToken, deleteId); setDeleteId(null); await load(); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  const set = (k: keyof CreateHall) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: k === "capacity" ? Number(e.target.value) : e.target.value }));

  return (
    <>
      <CrudTable
        label="Halls"
        onAdd={openAdd}
        isLoading={loading}
        error={error}
        headers={["Name", "Capacity", "Description"]}
        rows={items.map((h) => [h.name, String(h.capacity), h.description ?? "—"])}
        onEdit={openEdit}
        onDelete={(i) => setDeleteId(items[i].id)}
      />

      {showModal && (
        <Modal title={editId ? "Edit Hall" : "Add Hall"} onClose={() => setShowModal(false)} onSubmit={handleSave} isLoading={saving}>
          <Field label="Name"><input className={inputCls} value={form.name} onChange={set("name")} placeholder="Hall A" /></Field>
          <Field label="Capacity"><input type="number" className={inputCls} value={form.capacity} onChange={set("capacity")} /></Field>
          <Field label="Description"><textarea className={inputCls} rows={2} value={form.description || ""} onChange={set("description")} /></Field>
        </Modal>
      )}

      {deleteId && <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={saving} />}
    </>
  );
}
