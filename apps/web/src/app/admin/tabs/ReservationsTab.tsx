"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as svc from "@/services/reservations.service";
import * as showtimesSvc from "@/services/showtimes.service";
import * as moviesSvc from "@/services/movies.service";
import type { Reservation, CreateReservation } from "@/dto/reservation.dto";
import type { ShowTime } from "@/dto/showTime.dto";
import type { Movie } from "@/dto/movie.dto";
import { CrudTable, Modal, Field, inputCls, ConfirmDelete } from "./crud-ui";

const empty = (): CreateReservation => ({ userId: "", showTimeId: "" });

export default function ReservationsTab() {
  const { accessToken, user } = useAuth();
  const [items, setItems] = useState<Reservation[]>([]);
  const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateReservation>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!accessToken) return;
    setLoading(true);
    try { 
      const [res, sts, mvs] = await Promise.all([svc.getReservations(accessToken), showtimesSvc.getShowTimes(accessToken), moviesSvc.getMovies(accessToken)]);
      setItems(res);
      setShowTimes(sts);
      setMovies(mvs);
      setError(null); 
    }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [accessToken]);

  const formatDateForDisplay = (d: string) => {
    try { return new Date(d).toLocaleString(); } catch { return d; }
  };

  function openAdd() { setForm({ userId: user?.id || "", showTimeId: "" }); setEditId(null); setShowModal(true); }
  function openEdit(i: number) { const r = items[i]; setForm({ userId: r.userId, showTimeId: r.showTimeId }); setEditId(r.id); setShowModal(true); }

  async function handleSave() {
    if (!accessToken) return;
    setSaving(true);
    try {
      if (editId) await svc.updateReservation(accessToken, editId, form);
      else await svc.createReservation(accessToken, form);
      setShowModal(false); await load();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setSaving(true);
    try { await svc.deleteReservation(accessToken, deleteId); setDeleteId(null); await load(); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  const set = (k: keyof CreateReservation) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const getShowTimeDisplay = (stId: string) => {
    const st = showTimes.find(s => s.id === stId);
    if (!st) return stId;
    const mv = movies.find(m => m.id === st.movieId);
    return `${mv?.title || st.movieId} (${formatDateForDisplay(st.showTimeStart)})`;
  };

  return (
    <>
      <CrudTable
        label="Reservations"
        onAdd={openAdd}
        isLoading={loading}
        error={error}
        headers={["User ID", "Showtime", "Created At"]}
        rows={items.map((r) => [
          r.userId,
          getShowTimeDisplay(r.showTimeId),
          formatDateForDisplay(r.createdAt || "")
        ])}
        onEdit={openEdit}
        onDelete={(i) => setDeleteId(items[i].id)}
      />

      {showModal && (
        <Modal title={editId ? "Edit Reservation" : "Add Reservation"} onClose={() => setShowModal(false)} onSubmit={handleSave} isLoading={saving}>
          <Field label="User ID"><input className={inputCls} value={form.userId} onChange={set("userId")} placeholder="UUID..." /></Field>
          <Field label="Showtime">
            <select className={inputCls} value={form.showTimeId} onChange={set("showTimeId")}>
              <option value="">Select Showtime...</option>
              {showTimes.map(st => <option key={st.id} value={st.id}>{getShowTimeDisplay(st.id)}</option>)}
            </select>
          </Field>
        </Modal>
      )}

      {deleteId && <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={saving} />}
    </>
  );
}
