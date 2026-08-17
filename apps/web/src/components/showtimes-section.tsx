"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import type { ShowTime } from "@/dto/showTime.dto";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function getLocalDateStr(date: Date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function ShowTimesSection() {
  const [date, setDate] = useState<string>("");
  const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShowTimes() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ upcomingOnly: "true" });
        if (date) params.append("date", date);
        const res = await fetch(`${API_BASE}/showtimes?${params.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        setShowTimes(json.data ?? []);
      } catch {
        setShowTimes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchShowTimes();
  }, [date]); // re-fetches every time date changes

  return (
    <div className="w-full text-left py-8">
      <h2 className="text-3xl font-bold mb-6 text-foreground border-l-4 border-primary pl-3">Now Showing</h2>

      {/* Date Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Select Date</h3>
          <label className="flex items-center gap-2 cursor-pointer group">
            <span className="text-sm text-muted-foreground hidden sm:block group-hover:text-foreground transition-colors">
              Or pick from calendar:
            </span>
            <Input
              id="date-picker"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onClick={(e) => {
                try {
                  if ("showPicker" in HTMLInputElement.prototype) {
                    (e.target as HTMLInputElement).showPicker();
                  }
                } catch (err) {
                  // Fallback for browsers that do not support showPicker
                }
              }}
              className="w-auto h-8 text-xs bg-card border-border text-foreground cursor-pointer"
            />
          </label>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setDate("")}
            className={`flex shrink-0 flex-col items-center justify-center min-w-[5rem] h-20 rounded-xl border transition-all duration-300 ${
              date === ""
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-105"
                : "bg-card border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-card/80"
            }`}
          >
            <span className={`text-xs font-semibold uppercase tracking-wider ${date === "" ? 'text-white/90' : ''}`}>Any</span>
            <span className={`text-2xl font-bold mt-0.5 ${date === "" ? "text-white" : "text-foreground"}`}>All</span>
            <span className={`text-[10px] font-medium uppercase tracking-wider ${date === "" ? 'text-white/80' : ''}`}>Dates</span>
          </button>
          {Array.from({ length: 14 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const dateStr = getLocalDateStr(d);
            const isSelected = date === dateStr;
            
            const dayName = i === 0 ? "Today" : i === 1 ? "Tmrw" : d.toLocaleDateString("en-US", { weekday: "short" });
            const dayNumber = d.getDate();
            const monthName = d.toLocaleDateString("en-US", { month: "short" });
            
            return (
              <button
                key={dateStr}
                onClick={() => setDate(dateStr)}
                className={`flex shrink-0 flex-col items-center justify-center min-w-[5rem] h-20 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-105"
                    : "bg-card border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-card/80"
                }`}
              >
                <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? 'text-white/90' : ''}`}>{dayName}</span>
                <span className={`text-2xl font-bold mt-0.5 ${isSelected ? "text-white" : "text-foreground"}`}>{dayNumber}</span>
                <span className={`text-[10px] font-medium uppercase tracking-wider ${isSelected ? 'text-white/80' : ''}`}>{monthName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-muted-foreground text-lg">Loading showtimes...</p>
      ) : showTimes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {showTimes.map((st) => (
            <Card key={st.id} className="overflow-hidden bg-card border-border text-foreground hover:scale-[1.03] hover:border-primary/30 transition-all duration-300 group">
              {st.movie?.poster && (
                <img
                  src={st.movie.poster}
                  alt={st.movie.title}
                  className="w-full h-64 object-cover group-hover:brightness-110 transition-all duration-300"
                />
              )}
              <CardHeader>
                <CardTitle className="text-foreground font-bold">{st.movie?.title || "Unknown Movie"}</CardTitle>
                <CardDescription className="line-clamp-2 text-muted-foreground">
                  {st.movie?.description || "No description available."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    <strong className="text-foreground">Hall:</strong> {st.hall?.name || "Unknown"}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    <strong className="text-foreground">Start Time:</strong>{" "}
                    {new Date(st.showTimeStart).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    <strong className="text-foreground">Price:</strong> {st.basePrice} {st.baseCurrency || "EGP"}
                  </p>
                  <Link
                    href="/login"
                    className={buttonVariants({
                      className: "w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold",
                    })}
                  >
                    Book Tickets
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-lg">No upcoming showtimes for the selected date.</p>
      )}
    </div>
  );
}
