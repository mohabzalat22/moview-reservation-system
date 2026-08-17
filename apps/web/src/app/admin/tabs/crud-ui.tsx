"use client";

import { ReactNode } from "react";

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  children: ReactNode;
  submitLabel?: string;
}

export function Modal({ title, onClose, onSubmit, isLoading, children, submitLabel = "Save" }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-white text-xl font-bold transition-colors cursor-pointer">×</button>
        </div>
        <div className="px-6 py-4 space-y-4">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-white/[0.02] rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-white/10 hover:text-white transition cursor-pointer">Cancel</button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition cursor-pointer"
          >
            {isLoading ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  children: ReactNode;
}
export function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}

export const inputCls = "w-full border border-border bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition";

// ─── CrudTable ────────────────────────────────────────────────────────────────
interface ExtraAction {
  label: string;
  onClick: (i: number) => void;
  className?: string;
}

interface CrudTableProps {
  label: string;
  onAdd: () => void;
  isLoading: boolean;
  error: string | null;
  headers: string[];
  rows: ReactNode[][];
  onEdit?: (i: number) => void;
  onDelete?: (i: number) => void;
  extraActions?: ExtraAction[];
}

export function CrudTable({ label, onAdd, isLoading, error, headers, rows, onEdit, onDelete, extraActions }: CrudTableProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">{label}</h2>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition cursor-pointer"
        >
          + Add New
        </button>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm">{error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16 text-muted-foreground text-sm">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-muted-foreground text-sm gap-2">
          <span className="text-4xl">📭</span>
          No records found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                ))}
                {(onEdit || onDelete || (extraActions && extraActions.length > 0)) && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition">
                  {row.map((cell, j) => (
                    <td key={j} className="px-5 py-3 text-foreground">{cell}</td>
                  ))}
                  {(onEdit || onDelete || (extraActions && extraActions.length > 0)) && (
                    <td className="px-5 py-3 text-right space-x-2">
                      {onEdit && (
                        <button onClick={() => onEdit(i)} className="text-muted-foreground hover:text-white text-xs font-medium transition cursor-pointer">Edit</button>
                      )}
                      {extraActions && extraActions.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => action.onClick(i)}
                          className={action.className ?? "text-primary hover:text-white text-xs font-medium transition cursor-pointer"}
                        >
                          {action.label}
                        </button>
                      ))}
                      {onDelete && (
                        <button onClick={() => onDelete(i)} className="text-muted-foreground hover:text-primary text-xs font-medium transition cursor-pointer">Delete</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── ConfirmDelete ────────────────────────────────────────────────────────────
interface ConfirmDeleteProps {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}
export function ConfirmDelete({ onCancel, onConfirm, isLoading }: ConfirmDeleteProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4 border border-border">
        <div className="text-5xl">🗑️</div>
        <h3 className="text-lg font-semibold text-foreground">Delete Record?</h3>
        <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:bg-white/10 hover:text-white transition cursor-pointer">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition cursor-pointer"
          >
            {isLoading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
