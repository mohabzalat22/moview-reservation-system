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
  const [date, setDate] = useState<string>(getLocalDateStr());
  const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShowTimes() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ date, upcomingOnly: "true" });
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
    <div className="w-full max-w-6xl mx-auto text-left">
      <h2 className="text-3xl font-bold mb-6">Now Showing</h2>

      {/* Date Filter */}
      <div className="flex items-center gap-4 mb-8">
        <Label htmlFor="date-filter" className="text-base font-semibold whitespace-nowrap">
          Filter by Date
        </Label>
        <Input
          id="date-filter"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-48"
        />
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-gray-500 text-lg">Loading showtimes...</p>
      ) : showTimes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showTimes.map((st) => (
            <Card key={st.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {st.movie?.poster && (
                <img
                  src={st.movie.poster}
                  alt={st.movie.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <CardHeader>
                <CardTitle>{st.movie?.title || "Unknown Movie"}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {st.movie?.description || "No description available."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-700">
                    <strong>Hall:</strong> {st.hall?.name || "Unknown"}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    <strong>Start Time:</strong>{" "}
                    {new Date(st.showTimeStart).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    <strong>Price:</strong> {st.basePrice} {st.baseCurrency || "EGP"}
                  </p>
                  <Link
                    href="/login"
                    className={buttonVariants({
                      className: "w-full mt-4 bg-red-600 hover:bg-red-700",
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
        <p className="text-gray-500 text-lg">No upcoming showtimes for the selected date.</p>
      )}
    </div>
  );
}
