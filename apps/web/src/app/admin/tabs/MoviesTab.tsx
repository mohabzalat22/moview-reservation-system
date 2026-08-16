"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as svc from "@/services/movies.service";
import type { Movie, CreateMovie } from "@/dto/movie.dto";
import { CrudTable, Modal, Field, inputCls, ConfirmDelete } from "./crud-ui";

const empty = (): CreateMovie => ({ name: "", title: "", description: "", duration: 0, poster: null });

export default function MoviesTab() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateMovie>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!accessToken) return;
    setLoading(true);
    try { setItems(await svc.getMovies(accessToken)); setError(null); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [accessToken]);

  function openAdd() { setForm(empty()); setEditId(null); setShowModal(true); }
  function openEdit(i: number) { const m = items[i]; setForm({ name: m.name, title: m.title, description: m.description, duration: m.duration, poster: m.poster }); setEditId(m.id); setShowModal(true); }

  async function handleSave() {
    if (!accessToken) return;
    setSaving(true);
    try {
      if (editId) await svc.updateMovie(accessToken, editId, form);
      else await svc.createMovie(accessToken, form);
      setShowModal(false); await load();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setSaving(true);
    try { await svc.deleteMovie(accessToken, deleteId); setDeleteId(null); await load(); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  const set = (k: keyof CreateMovie) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: k === "duration" ? Number(e.target.value) : e.target.value }));

  return (
    <>
      <CrudTable
        label="Movies"
        onAdd={openAdd}
        isLoading={loading}
        error={error}
        headers={["Name", "Title", "Duration (min)", "Poster"]}
        rows={items.map((m) => [m.name, m.title, String(m.duration), m.poster ?? "—"])}
        onEdit={openEdit}
        onDelete={(i) => setDeleteId(items[i].id)}
      />

      {showModal && (
        <Modal title={editId ? "Edit Movie" : "Add Movie"} onClose={() => setShowModal(false)} onSubmit={handleSave} isLoading={saving}>
          <Field label="Name"><input className={inputCls} value={form.name} onChange={set("name")} placeholder="Inception" /></Field>
          <Field label="Title"><input className={inputCls} value={form.title} onChange={set("title")} placeholder="Inception (2010)" /></Field>
          <Field label="Description"><textarea className={inputCls} rows={3} value={form.description} onChange={set("description")} /></Field>
          <Field label="Duration (minutes)"><input type="number" className={inputCls} value={form.duration} onChange={set("duration")} /></Field>
          <Field label="Poster URL"><input className={inputCls} value={form.poster ?? ""} onChange={set("poster")} placeholder="https://…" /></Field>
        </Modal>
      )}

      {deleteId && <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={saving} />}
    </>
  );
}
