"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getReservations, updateReservationStatus } from "@/services/reservations.service";
import { getMovies } from "@/services/movies.service";
import { getShowTimes } from "@/services/showtimes.service";
import { getHalls } from "@/services/halls.service";
import type { Reservation } from "@/dto/reservation.dto";
import { ReservationStatus } from "@/dto/reservation.dto";
import type { Movie } from "@/dto/movie.dto";
import type { ShowTime } from "@/dto/showTime.dto";
import type { Hall } from "@/dto/hall.dto";

const STATUS_CONFIG: Record<ReservationStatus, { label: string; className: string }> = {
  [ReservationStatus.PENDING]:   { label: "Pending",   className: "bg-yellow-100 text-yellow-800" },
  [ReservationStatus.CONFIRMED]: { label: "Confirmed", className: "bg-green-100 text-green-800" },
  [ReservationStatus.CANCELLED]: { label: "Cancelled", className: "bg-red-100 text-red-800" },
};

export default function MyReservationsPage() {
  const { user, isLoading, accessToken: token } = useAuth();
  const router = useRouter();

  const [upcoming, setUpcoming] = useState<Reservation[]>([]);
  const [history, setHistory] = useState<Reservation[]>([]);
  const [movies, setMovies] = useState<Record<string, Movie>>({});
  const [showtimes, setShowtimes] = useState<Record<string, ShowTime>>({});
  const [halls, setHalls] = useState<Record<string, Hall>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/reservations");
    }
  }, [user, isLoading, router]);

  async function loadData() {
    if (!token || !user) return;
    try {
      const [allRes, allMovies, allShowtimes, allHalls] = await Promise.all([
        getReservations(token as string),
        getMovies(),
        getShowTimes(),
        getHalls()
      ]);

      const userRes = allRes.filter(r => r.userId === user?.id);
      
      const movieMap: Record<string, Movie> = {};
      allMovies.forEach(m => movieMap[m.id] = m);

      const showtimeMap: Record<string, ShowTime> = {};
      allShowtimes.forEach(st => showtimeMap[st.id] = st);

      const hallMap: Record<string, Hall> = {};
      allHalls.forEach(h => hallMap[h.id] = h);

      const now = new Date().getTime();
      const upc: Reservation[] = [];
      const pst: Reservation[] = [];

      userRes.forEach(res => {
        const st = showtimeMap[res.showTimeId];
        if (st && new Date(st.showTimeStart).getTime() >= now) {
          upc.push(res);
        } else {
          pst.push(res);
        }
      });

      setUpcoming(upc.sort((a, b) => {
        const tA = showtimeMap[a.showTimeId] ? new Date(showtimeMap[a.showTimeId].showTimeStart).getTime() : 0;
        const tB = showtimeMap[b.showTimeId] ? new Date(showtimeMap[b.showTimeId].showTimeStart).getTime() : 0;
        return tA - tB;
      }));

      setHistory(pst.sort((a, b) => {
        const tA = showtimeMap[a.showTimeId] ? new Date(showtimeMap[a.showTimeId].showTimeStart).getTime() : 0;
        const tB = showtimeMap[b.showTimeId] ? new Date(showtimeMap[b.showTimeId].showTimeStart).getTime() : 0;
        return tB - tA;
      }));

      setMovies(movieMap);
      setShowtimes(showtimeMap);
      setHalls(hallMap);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    if (isLoading || !user || !token) return;
    loadData();
  }, [isLoading, user, token]);

  async function handleCancel(reservationId: string) {
    if (!token) return;
    setCancellingId(reservationId);
    try {
      await updateReservationStatus(token, reservationId, { status: ReservationStatus.CANCELLED });
      await loadData();
    } catch (err) {
      console.error("Failed to cancel reservation", err);
    } finally {
      setCancellingId(null);
    }
  }

  if (isLoading || loadingData) {
    return <div className="container mx-auto px-4 py-8">Loading reservations...</div>;
  }

  const renderReservationCard = (res: Reservation, isUpcoming: boolean) => {
    const showtime = showtimes[res.showTimeId];
    const movie = showtime ? movies[showtime.movieId] : null;
    const hall = showtime ? halls[showtime.hallId] : null;
    const seatCount = res.seats?.length || 0;
    const totalPrice = res.seats?.reduce((acc, seat) => acc + Number(seat.price || 0), 0) || 0;
    const date = showtime ? new Date(showtime.showTimeStart) : null;
    const status = res.status ?? ReservationStatus.PENDING;
    const statusConfig = STATUS_CONFIG[status];
    const isCancellable = isUpcoming && status !== ReservationStatus.CANCELLED;

    return (
      <div key={res.id} className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col">
        <div className="flex justify-between items-start mb-4 border-b pb-4">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">{movie?.title || "Unknown Movie"}</h3>
            <p className="text-gray-500 text-sm">{hall?.name || "Unknown Hall"}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
        </div>
        
        <div className="flex-1 space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Date</span>
            <span className="font-medium text-sm">
              {date ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Time</span>
            <span className="font-medium text-sm">
              {date ? date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Seats</span>
            <span className="font-medium text-sm">{seatCount} Ticket{seatCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="font-bold text-red-600">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Link href={`/reservations/${res.id}`} className="flex-1">
            <Button variant="outline" className="w-full">View Details</Button>
          </Link>
          {isCancellable && (
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              disabled={cancellingId === res.id}
              onClick={() => handleCancel(res.id)}
            >
              {cancellingId === res.id ? "Cancelling…" : "Cancel"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
      <h1 className="text-3xl font-bold mb-8">My Reservations</h1>
      
      {upcoming.length === 0 && history.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500 mb-6">You don&apos;t have any reservations yet.</p>
          <Link href="/movies">
            <Button className="bg-red-600 hover:bg-red-700">Browse Movies</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Upcoming Reservations</h2>
            {upcoming.length === 0 ? (
              <p className="text-gray-500 italic">No upcoming reservations.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map(r => renderReservationCard(r, true))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Past Reservations</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 italic">No past reservations.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {history.map(r => renderReservationCard(r, false))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
