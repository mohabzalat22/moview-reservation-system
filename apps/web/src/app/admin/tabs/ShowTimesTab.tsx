"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as svc from "@/services/showtimes.service";
import * as moviesSvc from "@/services/movies.service";
import * as hallsSvc from "@/services/halls.service";
import type { ShowTime, CreateShowTime } from "@/dto/showTime.dto";
import type { Movie } from "@/dto/movie.dto";
import type { Hall } from "@/dto/hall.dto";
import { CrudTable, Modal, Field, inputCls, ConfirmDelete } from "./crud-ui";

const empty = (): CreateShowTime => ({ basePrice: 0, baseCurrency: "USD", showTimeStart: "", showTimeEnd: "", movieId: "", hallId: "" });

export default function ShowTimesTab() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<ShowTime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateShowTime>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!accessToken) return;
    setLoading(true);
    try { 
      const [sts, mvs, hls] = await Promise.all([svc.getShowTimes(accessToken), moviesSvc.getMovies(accessToken), hallsSvc.getHalls(accessToken)]);
      setItems(sts);
      setMovies(mvs);
      setHalls(hls);
      setError(null); 
    }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [accessToken]);

  const formatDateForInput = (d: string) => {
    try { return new Date(d).toISOString().slice(0, 16); } catch { return ""; }
  };

  const formatDateForDisplay = (d: string) => {
    try { return new Date(d).toLocaleString(); } catch { return d; }
  };

  function openAdd() { setForm(empty()); setEditId(null); setShowModal(true); }
  function openEdit(i: number) { 
    const s = items[i]; 
    setForm({ 
      basePrice: Number(s.basePrice), 
      baseCurrency: s.baseCurrency || "USD", 
      showTimeStart: formatDateForInput(s.showTimeStart), 
      showTimeEnd: formatDateForInput(s.showTimeEnd), 
      movieId: s.movieId, 
      hallId: s.hallId 
    }); 
    setEditId(s.id); 
    setShowModal(true); 
  }

  async function handleSave() {
    if (!accessToken) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        showTimeStart: new Date(form.showTimeStart).toISOString(),
        showTimeEnd: new Date(form.showTimeEnd).toISOString(),
      };
      if (editId) await svc.updateShowTime(accessToken, editId, payload);
      else await svc.createShowTime(accessToken, payload);
      setShowModal(false); await load();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setSaving(true);
    try { await svc.deleteShowTime(accessToken, deleteId); setDeleteId(null); await load(); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  const set = (k: keyof CreateShowTime) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: k === "basePrice" ? Number(e.target.value) : e.target.value }));

  return (
    <>
      <CrudTable
        label="Showtimes"
        onAdd={openAdd}
        isLoading={loading}
        error={error}
        headers={["Movie", "Hall", "Start Time", "End Time", "Base Price"]}
        rows={items.map((s) => [
          movies.find(m => m.id === s.movieId)?.title || s.movieId,
          halls.find(h => h.id === s.hallId)?.name || s.hallId,
          formatDateForDisplay(s.showTimeStart),
          formatDateForDisplay(s.showTimeEnd),
          `${s.basePrice} ${s.baseCurrency || 'USD'}`
        ])}
        onEdit={openEdit}
        onDelete={(i) => setDeleteId(items[i].id)}
      />

      {showModal && (
        <Modal title={editId ? "Edit Showtime" : "Add Showtime"} onClose={() => setShowModal(false)} onSubmit={handleSave} isLoading={saving}>
          <Field label="Movie">
            <select className={inputCls} value={form.movieId} onChange={set("movieId")}>
              <option value="">Select Movie...</option>
              {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </Field>
          <Field label="Hall">
            <select className={inputCls} value={form.hallId} onChange={set("hallId")}>
              <option value="">Select Hall...</option>
              {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </Field>
          <Field label="Start Time"><input type="datetime-local" className={inputCls} value={form.showTimeStart} onChange={set("showTimeStart")} /></Field>
          <Field label="End Time"><input type="datetime-local" className={inputCls} value={form.showTimeEnd} onChange={set("showTimeEnd")} /></Field>
          <Field label="Base Price"><input type="number" step="0.01" className={inputCls} value={form.basePrice} onChange={set("basePrice")} /></Field>
          <Field label="Currency"><input className={inputCls} value={form.baseCurrency} onChange={set("baseCurrency")} placeholder="USD" /></Field>
        </Modal>
      )}

      {deleteId && <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={saving} />}
    </>
  );
}
