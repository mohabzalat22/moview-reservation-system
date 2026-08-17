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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        </div>
        <div className="px-6 py-4 space-y-4">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-100 transition">Cancel</button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

export const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

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
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-base font-semibold text-gray-800">{label}</h2>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          + Add New
        </button>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16 text-gray-400 text-sm">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400 text-sm gap-2">
          <span className="text-4xl">📭</span>
          No records found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                ))}
                {(onEdit || onDelete || (extraActions && extraActions.length > 0)) && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  {row.map((cell, j) => (
                    <td key={j} className="px-5 py-3 text-gray-700">{cell}</td>
                  ))}
                  {(onEdit || onDelete || (extraActions && extraActions.length > 0)) && (
                    <td className="px-5 py-3 text-right space-x-2">
                      {onEdit && (
                        <button onClick={() => onEdit(i)} className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                      )}
                      {extraActions && extraActions.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => action.onClick(i)}
                          className={action.className ?? "text-purple-600 hover:underline text-xs font-medium"}
                        >
                          {action.label}
                        </button>
                      ))}
                      {onDelete && (
                        <button onClick={() => onDelete(i)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
        <div className="text-5xl">🗑️</div>
        <h3 className="text-lg font-semibold text-gray-900">Delete Record?</h3>
        <p className="text-sm text-gray-500">This action cannot be undone.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 transition">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
          >
            {isLoading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
