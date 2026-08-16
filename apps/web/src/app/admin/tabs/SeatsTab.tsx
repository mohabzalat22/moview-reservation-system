"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as svc from "@/services/seats.service";
import * as sectionsSvc from "@/services/sections.service";
import * as hallsSvc from "@/services/halls.service";
import type { Seat, CreateSeat } from "@/dto/seat.dto";
import type { Section } from "@/dto/section.dto";
import type { Hall } from "@/dto/hall.dto";
import { CrudTable, Modal, Field, inputCls, ConfirmDelete } from "./crud-ui";

const empty = (): CreateSeat => ({ sectionId: "", number: 0 });

export default function SeatsTab() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<Seat[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateSeat>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!accessToken) return;
    setLoading(true);
    try { 
      const [sts, secs, hls] = await Promise.all([svc.getSeats(accessToken), sectionsSvc.getSections(accessToken), hallsSvc.getHalls(accessToken)]);
      setItems(sts);
      setSections(secs);
      setHalls(hls);
      setError(null); 
    }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [accessToken]);

  function openAdd() { setForm(empty()); setEditId(null); setShowModal(true); }
  function openEdit(i: number) { const s = items[i]; setForm({ sectionId: s.sectionId, number: s.number }); setEditId(s.id); setShowModal(true); }

  async function handleSave() {
    if (!accessToken) return;
    setSaving(true);
    try {
      if (editId) await svc.updateSeat(accessToken, editId, form);
      else await svc.createSeat(accessToken, form);
      setShowModal(false); await load();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setSaving(true);
    try { await svc.deleteSeat(accessToken, deleteId); setDeleteId(null); await load(); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  const set = (k: keyof CreateSeat) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: k === "number" ? Number(e.target.value) : e.target.value }));

  const getSectionName = (secId: string) => {
    const sec = sections.find(s => s.id === secId);
    if (!sec) return secId;
    const hall = halls.find(h => h.id === sec.hallId);
    return `${hall?.name || 'Unknown Hall'} - ${sec.name}`;
  };

  return (
    <>
      <CrudTable
        label="Seats"
        onAdd={openAdd}
        isLoading={loading}
        error={error}
        headers={["Number", "Section"]}
        rows={items.map((s) => [String(s.number), getSectionName(s.sectionId)])}
        onEdit={openEdit}
        onDelete={(i) => setDeleteId(items[i].id)}
      />

      {showModal && (
        <Modal title={editId ? "Edit Seat" : "Add Seat"} onClose={() => setShowModal(false)} onSubmit={handleSave} isLoading={saving}>
          <Field label="Section">
            <select className={inputCls} value={form.sectionId} onChange={set("sectionId")}>
              <option value="">Select Section...</option>
              {sections.map(s => <option key={s.id} value={s.id}>{getSectionName(s.id)}</option>)}
            </select>
          </Field>
          <Field label="Seat Number"><input type="number" className={inputCls} value={form.number} onChange={set("number")} /></Field>
        </Modal>
      )}

      {deleteId && <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={saving} />}
    </>
  );
}
