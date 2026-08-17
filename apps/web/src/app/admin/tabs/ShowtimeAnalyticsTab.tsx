"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getShowTimes,
  getShowTimeStats,
  type ShowTimeStats,
} from "@/services/showtimes.service";
import { getMovies } from "@/services/movies.service";
import type { ShowTime } from "@/dto/showTime.dto";
import type { Movie } from "@/dto/movie.dto";

// ─── Tiny helpers ────────────────────────────────────────────────────────────

function fmt(d: string) {
  try {
    return new Date(d).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return d;
  }
}

function pct(value: number, total: number) {
  return total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
}

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className="rounded-xl border bg-white p-5 shadow-sm flex flex-col gap-1"
      style={{ borderLeftWidth: 4, borderLeftColor: accent ?? "#6366f1" }}
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  );
}

// ─── Radial occupancy ring ────────────────────────────────────────────────────

function OccupancyRing({ rate }: { rate: number }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const dash = (rate / 100) * circumference;

  const color =
    rate >= 80 ? "#22c55e" : rate >= 50 ? "#f59e0b" : "#6366f1";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle
          cx={50}
          cy={50}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={10}
        />
        <circle
          cx={50}
          cy={50}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <text
          x={50}
          y={54}
          textAnchor="middle"
          fill="#111827"
          fontSize={14}
          fontWeight={700}
        >
          {rate.toFixed(1)}%
        </text>
      </svg>
      <span className="text-xs text-gray-500 font-medium">Occupancy</span>
    </div>
  );
}

// ─── Section row ──────────────────────────────────────────────────────────────

function SectionRow({
  s,
  currency,
}: {
  s: ShowTimeStats["sectionBreakdown"][number];
  currency: string;
}) {
  const occupancy = s.totalSeats > 0 ? (s.reservedSeats / s.totalSeats) * 100 : 0;
  const barColor =
    occupancy >= 80 ? "#22c55e" : occupancy >= 50 ? "#f59e0b" : "#6366f1";

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 font-medium text-gray-800">{s.sectionName}</td>
      <td className="py-3 px-4 text-gray-600">
        +{s.additionPrice.toFixed(2)} {currency}
      </td>
      <td className="py-3 px-4 text-center text-gray-600">{s.totalSeats}</td>
      <td className="py-3 px-4 text-center text-gray-600">{s.reservedSeats}</td>
      <td className="py-3 px-4 text-center text-gray-600">
        {s.totalSeats - s.reservedSeats}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${occupancy}%`, backgroundColor: barColor }}
            />
          </div>
          <span className="text-xs text-gray-500 w-10 text-right">
            {pct(s.reservedSeats, s.totalSeats)}%
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-right font-semibold text-gray-800">
        {s.revenue.toFixed(2)} {currency}
      </td>
    </tr>
  );
}

// ─── Stats panel ─────────────────────────────────────────────────────────────

function StatsPanel({
  stats,
  onClose,
}: {
  stats: ShowTimeStats;
  onClose: () => void;
}) {
  const cur = stats.baseCurrency;

  return (
    <div className="mt-6 rounded-2xl border bg-white shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
        <div>
          <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">
            Showtime Analytics
          </p>
          <h2 className="text-white text-xl font-bold">{stats.movieTitle}</h2>
          <p className="text-indigo-200 text-sm mt-0.5">
            {stats.hallName} · {fmt(stats.showTimeStart)} — {fmt(stats.showTimeEnd)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-indigo-200 hover:text-white mt-0.5 text-xl leading-none transition-colors"
          aria-label="Close stats"
        >
          ✕
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI row */}
        <div className="flex flex-wrap gap-4 items-start">
          <div className="flex-1 min-w-[120px]">
            <OccupancyRing rate={stats.occupancyRate} />
          </div>
          <div className="flex-[5] grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Total Seats"
              value={stats.totalSeats}
              accent="#6366f1"
            />
            <StatCard
              label="Reserved"
              value={stats.reservedSeats}
              sub={`${pct(stats.reservedSeats, stats.totalSeats)}% of capacity`}
              accent="#f59e0b"
            />
            <StatCard
              label="Available"
              value={stats.availableSeats}
              sub={`${pct(stats.availableSeats, stats.totalSeats)}% remaining`}
              accent="#22c55e"
            />
            <StatCard
              label="Total Revenue"
              value={`${stats.totalRevenue.toFixed(2)} ${cur}`}
              sub={`Base price: ${stats.basePrice.toFixed(2)} ${cur}`}
              accent="#ec4899"
            />
          </div>
        </div>

        {/* Section breakdown table */}
        {stats.sectionBreakdown.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Section Breakdown
            </h3>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-left">Section</th>
                    <th className="py-3 px-4 text-left">Price Add-on</th>
                    <th className="py-3 px-4 text-center">Total</th>
                    <th className="py-3 px-4 text-center">Reserved</th>
                    <th className="py-3 px-4 text-center">Available</th>
                    <th className="py-3 px-4 text-left">Occupancy</th>
                    <th className="py-3 px-4 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.sectionBreakdown.map((s) => (
                    <SectionRow key={s.sectionId} s={s} currency={cur} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic text-center py-4">
            No sections configured for this hall.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main tab ────────────────────────────────────────────────────────────────

export default function ShowtimeAnalyticsTab() {
  const { accessToken } = useAuth();
  const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stats, setStats] = useState<ShowTimeStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    Promise.all([
      getShowTimes(accessToken),
      getMovies(accessToken),
    ])
      .then(([sts, mvs]) => {
        setShowTimes(sts);
        setMovies(mvs);
        setError(null);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function loadStats(id: string) {
    if (!accessToken) return;
    setSelectedId(id);
    setStats(null);
    setStatsError(null);
    setStatsLoading(true);
    try {
      const data = await getShowTimeStats(accessToken, id);
      setStats(data);
    } catch (e: unknown) {
      setStatsError((e as Error).message);
    } finally {
      setStatsLoading(false);
    }
  }

  const getMovieTitle = (movieId: string) =>
    movies.find((m) => m.id === movieId)?.title ?? "Unknown";

  const filtered = showTimes.filter((st) =>
    getMovieTitle(st.movieId).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Showtime Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Select a showtime to view capacity and revenue breakdown.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by movie…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 w-56"
        />
      </div>

      {/* Loading / error */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full" />
          Loading showtimes…
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Showtime cards grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 col-span-full text-center py-8">
              No showtimes found.
            </p>
          )}
          {filtered.map((st) => {
            const isSelected = st.id === selectedId;
            return (
              <button
                key={st.id}
                onClick={() => loadStats(st.id)}
                className={`text-left rounded-xl border p-4 transition-all shadow-sm hover:shadow-md hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`font-semibold text-sm truncate ${
                      isSelected ? "text-indigo-700" : "text-gray-900"
                    }`}
                  >
                    {getMovieTitle(st.movieId)}
                  </p>
                  {isSelected && (
                    <span className="shrink-0 text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(st.showTimeStart).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Base: {Number(st.basePrice).toFixed(2)} {st.baseCurrency ?? "EGP"}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Stats loading indicator */}
      {statsLoading && (
        <div className="flex items-center gap-2 text-sm text-indigo-500 py-6 justify-center">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full" />
          Fetching analytics…
        </div>
      )}

      {/* Stats error */}
      {statsError && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
          {statsError}
        </div>
      )}

      {/* Stats panel */}
      {stats && !statsLoading && (
        <StatsPanel stats={stats} onClose={() => { setStats(null); setSelectedId(null); }} />
      )}
    </div>
  );
}
