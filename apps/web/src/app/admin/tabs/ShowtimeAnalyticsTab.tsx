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
      className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-1"
      style={{ borderLeftWidth: 4, borderLeftColor: accent ?? "var(--primary)" }}
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

// ─── Radial occupancy ring ────────────────────────────────────────────────────

function OccupancyRing({ rate }: { rate: number }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const dash = (rate / 100) * circumference;

  const color =
    rate >= 80 ? "#22c55e" : rate >= 50 ? "#f59e0b" : "var(--primary)";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle
          cx={50}
          cy={50}
          r={r}
          fill="none"
          stroke="var(--muted)"
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
          fill="var(--foreground)"
          fontSize={14}
          fontWeight={700}
        >
          {rate.toFixed(1)}%
        </text>
      </svg>
      <span className="text-xs text-muted-foreground font-medium">Occupancy</span>
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
    occupancy >= 80 ? "#22c55e" : occupancy >= 50 ? "#f59e0b" : "var(--primary)";

  return (
    <tr className="border-b border-white/[0.04] last:border-0 hover:bg-white/5 transition-colors">
      <td className="py-3 px-4 font-medium text-foreground">{s.sectionName}</td>
      <td className="py-3 px-4 text-muted-foreground">
        +{s.additionPrice.toFixed(2)} {currency}
      </td>
      <td className="py-3 px-4 text-center text-muted-foreground">{s.totalSeats}</td>
      <td className="py-3 px-4 text-center text-muted-foreground">{s.reservedSeats}</td>
      <td className="py-3 px-4 text-center text-muted-foreground">
        {s.totalSeats - s.reservedSeats}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${occupancy}%`, backgroundColor: barColor }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-10 text-right">
            {pct(s.reservedSeats, s.totalSeats)}%
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-right font-semibold text-foreground">
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
    <div className="mt-6 rounded-2xl border border-border bg-card shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 bg-primary px-6 py-5">
        <div>
          <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
            Showtime Analytics
          </p>
          <h2 className="text-white text-xl font-bold">{stats.movieTitle}</h2>
          <p className="text-white/90 text-sm mt-0.5">
            {stats.hallName} · {fmt(stats.showTimeStart)} — {fmt(stats.showTimeEnd)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white mt-0.5 text-xl leading-none transition-colors cursor-pointer"
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
              accent="var(--foreground)"
            />
            <StatCard
              label="Reserved"
              value={stats.reservedSeats}
              sub={`${pct(stats.reservedSeats, stats.totalSeats)}% of capacity`}
              accent="var(--primary)"
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
              accent="var(--muted-foreground)"
            />
          </div>
        </div>

        {/* Section breakdown table */}
        {stats.sectionBreakdown.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Section Breakdown
            </h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.03] text-muted-foreground text-xs uppercase tracking-wider">
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
                <tbody className="divide-y divide-white/[0.04]">
                  {stats.sectionBreakdown.map((s) => (
                    <SectionRow key={s.sectionId} s={s} currency={cur} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic text-center py-4">
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
          <h2 className="text-lg font-bold text-foreground">
            Showtime Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select a showtime to view capacity and revenue breakdown.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by movie…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary w-56 transition-all"
        />
      </div>

      {/* Loading / error */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
          Loading showtimes…
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Showtime cards grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full text-center py-8">
              No showtimes found.
            </p>
          )}
          {filtered.map((st) => {
            const isSelected = st.id === selectedId;
            return (
              <button
                key={st.id}
                onClick={() => loadStats(st.id)}
                className={`text-left rounded-xl border p-4 transition-all shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`font-semibold text-sm truncate ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {getMovieTitle(st.movieId)}
                  </p>
                  {isSelected && (
                    <span className="shrink-0 text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(st.showTimeStart).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  Base: {Number(st.basePrice).toFixed(2)} {st.baseCurrency ?? "EGP"}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Stats loading indicator */}
      {statsLoading && (
        <div className="flex items-center gap-2 text-sm text-primary py-6 justify-center">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
          Fetching analytics…
        </div>
      )}

      {/* Stats error */}
      {statsError && (
        <div className="rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm px-4 py-3">
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
