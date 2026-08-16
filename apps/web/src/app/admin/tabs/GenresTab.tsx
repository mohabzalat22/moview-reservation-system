"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as svc from "@/services/genres.service";
import type { Genre, CreateGenre } from "@/dto/genre.dto";
import { CrudTable, Modal, Field, inputCls, ConfirmDelete } from "./crud-ui";

const empty = (): CreateGenre => ({ name: "" });

export default function GenresTab() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateGenre>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!accessToken) return;
    setLoading(true);
    try { setItems(await svc.getGenres(accessToken)); setError(null); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [accessToken]);

  function openAdd() { setForm(empty()); setEditId(null); setShowModal(true); }
  function openEdit(i: number) { const g = items[i]; setForm({ name: g.name }); setEditId(g.id); setShowModal(true); }

  async function handleSave() {
    if (!accessToken) return;
    setSaving(true);
    try {
      if (editId) await svc.updateGenre(accessToken, editId, form);
      else await svc.createGenre(accessToken, form);
      setShowModal(false); await load();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setSaving(true);
    try { await svc.deleteGenre(accessToken, deleteId); setDeleteId(null); await load(); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  const set = (k: keyof CreateGenre) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <CrudTable
        label="Genres"
        onAdd={openAdd}
        isLoading={loading}
        error={error}
        headers={["Name"]}
        rows={items.map((g) => [g.name])}
        onEdit={openEdit}
        onDelete={(i) => setDeleteId(items[i].id)}
      />

      {showModal && (
        <Modal title={editId ? "Edit Genre" : "Add Genre"} onClose={() => setShowModal(false)} onSubmit={handleSave} isLoading={saving}>
          <Field label="Name"><input className={inputCls} value={form.name} onChange={set("name")} placeholder="Action" /></Field>
        </Modal>
      )}

      {deleteId && <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={saving} />}
    </>
  );
}
