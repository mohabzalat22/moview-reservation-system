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
import { getSeats } from "@/services/seats.service";
import { getSections } from "@/services/sections.service";
import type { Reservation } from "@/dto/reservation.dto";
import { ReservationStatus } from "@/dto/reservation.dto";
import type { Movie } from "@/dto/movie.dto";
import type { ShowTime } from "@/dto/showTime.dto";
import type { Hall } from "@/dto/hall.dto";
import type { Seat } from "@/dto/seat.dto";
import type { Section } from "@/dto/section.dto";
import { use } from "react";

const STATUS_CONFIG: Record<ReservationStatus, { label: string; className: string }> = {
  [ReservationStatus.PENDING]:   { label: "Pending",   className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  [ReservationStatus.CONFIRMED]: { label: "Confirmed", className: "bg-green-100 text-green-800 border-green-200" },
  [ReservationStatus.CANCELLED]: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
};

export default function ReservationDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { user, isLoading, accessToken: token } = useAuth();
  const router = useRouter();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<ShowTime | null>(null);
  const [hall, setHall] = useState<Hall | null>(null);
  const [reservedSeatsInfo, setReservedSeatsInfo] = useState<{ number: number, sectionName: string }[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=/reservations/${params.id}`);
    }
  }, [user, isLoading, router, params.id]);

  async function loadData() {
    if (!token || !user) return;
    try {
      const [allRes, allMovies, allShowtimes, allHalls, allSeats, allSections] = await Promise.all([
        getReservations(token as string),
        getMovies(),
        getShowTimes(),
        getHalls(),
        getSeats(),
        getSections()
      ]);

      const currentRes = allRes.find(r => r.id === params.id && r.userId === user?.id);
      if (currentRes) {
        setReservation(currentRes);
        
        const st = allShowtimes.find(s => s.id === currentRes.showTimeId);
        setShowtime(st || null);
        
        if (st) {
          setMovie(allMovies.find(m => m.id === st.movieId) || null);
          setHall(allHalls.find(h => h.id === st.hallId) || null);
        }

        if (currentRes.seats) {
          const seatsInfo = currentRes.seats.map(rs => {
            const seat = allSeats.find(s => s.id === rs.seatId);
            const section = seat ? allSections.find(sec => sec.id === seat.sectionId) : null;
            return {
              number: seat?.number || 0,
              sectionName: section?.name || "Unknown"
            };
          });
          setReservedSeatsInfo(seatsInfo);
        }
      }
    } catch (err) {
      console.error("Failed to load reservation details:", err);
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    if (isLoading || !user || !token) return;
    loadData();
  }, [isLoading, user, token, params.id]);

  async function handleCancel() {
    if (!token || !reservation) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await updateReservationStatus(token, reservation.id, { status: ReservationStatus.CANCELLED });
      await loadData();
    } catch (err) {
      setCancelError((err as Error).message || "Failed to cancel reservation");
    } finally {
      setCancelling(false);
    }
  }

  if (isLoading || loadingData) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Reservation not found</h1>
        <Link href="/reservations" className="text-blue-500 hover:underline">Back to My Reservations</Link>
      </div>
    );
  }

  const date = showtime ? new Date(showtime.showTimeStart) : null;
  const totalPrice = reservation.seats?.reduce((acc, seat) => acc + Number(seat.price || 0), 0) || 0;
  const status = reservation.status ?? ReservationStatus.PENDING;
  const statusConfig = STATUS_CONFIG[status];
  const isUpcoming = showtime ? new Date(showtime.showTimeStart).getTime() >= Date.now() : false;
  const isCancellable = isUpcoming && status !== ReservationStatus.CANCELLED;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
      <Link href="/reservations" className="text-blue-500 hover:underline mb-6 inline-block">
        &larr; Back to My Reservations
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Reservation Details</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
        <div className="flex justify-between items-start mb-6 pb-6 border-b">
          <div>
            <p className="text-sm text-gray-500 mb-1">Reservation ID</p>
            <p className="font-mono text-sm">{reservation.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Movie</p>
              <p className="font-medium text-lg">{movie?.title || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date &amp; Time</p>
              <p className="font-medium text-lg">
                {date ? `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - ${date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}` : "Unknown"}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Hall</p>
              <p className="font-medium text-lg">{hall?.name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Seats</p>
              <p className="font-medium text-lg">
                {reservedSeatsInfo.length > 0 
                  ? reservedSeatsInfo.map(s => `${s.sectionName}-${s.number}`).join(", ") 
                  : "None"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <div>
               <p className="text-sm text-gray-500 mb-1">Booked on</p>
               <p className="text-sm font-medium">{new Date(reservation.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
            <p className="text-2xl font-bold text-red-600">Total: ${totalPrice.toFixed(2)}</p>
          </div>

          {cancelError && (
            <p className="text-red-600 text-sm mb-3">{cancelError}</p>
          )}

          {isCancellable && (
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              disabled={cancelling}
              onClick={handleCancel}
            >
              {cancelling ? "Cancelling…" : "Cancel Reservation"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
