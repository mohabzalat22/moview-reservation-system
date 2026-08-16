"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getShowTimes } from "@/services/showtimes.service";
import { getHalls } from "@/services/halls.service";
import { getSections } from "@/services/sections.service";
import { getSeats } from "@/services/seats.service";
import { getReservations, createReservation } from "@/services/reservations.service";
import type { ShowTime } from "@/dto/showTime.dto";
import type { Hall } from "@/dto/hall.dto";
import type { Section } from "@/dto/section.dto";
import type { Seat } from "@/dto/seat.dto";
import type { Reservation } from "@/dto/reservation.dto";

import { use } from "react";

export default function SeatSelectionPage(props: { params: Promise<{ showtimeId: string }> }) {
  const params = use(props.params);
  const { user, isLoading, accessToken: token } = useAuth();
  const router = useRouter();

  const [showtime, setShowtime] = useState<ShowTime | null>(null);
  const [hall, setHall] = useState<Hall | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [occupiedSeatIds, setOccupiedSeatIds] = useState<Set<string>>(new Set());
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=/showtimes/${params.showtimeId}/seats`);
    }
  }, [user, isLoading, router, params.showtimeId]);

  useEffect(() => {
    if (isLoading || !user || !token) return;

    async function loadData() {
      try {
        const [allShowtimes, allHalls, allSections, allSeats, allReservations] = await Promise.all([
          getShowTimes(),
          getHalls(),
          getSections(),
          getSeats(),
          getReservations(token as string)
        ]);

        const currentShowtime = allShowtimes.find(st => st.id === params.showtimeId);
        if (currentShowtime) {
          setShowtime(currentShowtime);
          
          const currentHall = allHalls.find(h => h.id === currentShowtime.hallId);
          setHall(currentHall || null);

          const hallSections = allSections.filter(s => s.hallId === currentShowtime.hallId);
          setSections(hallSections);

          const hallSectionIds = new Set(hallSections.map(s => s.id));
          const hallSeats = allSeats.filter(s => hallSectionIds.has(s.sectionId));
          setSeats(hallSeats);

          // Find occupied seats for this showtime
          const showtimeReservations = allReservations.filter(r => r.showTimeId === params.showtimeId);
          const occupiedIds = new Set<string>();
          showtimeReservations.forEach(res => {
            res.seats?.forEach(rs => occupiedIds.add(rs.seatId));
          });
          setOccupiedSeatIds(occupiedIds);
        }
      } catch (err) {
        console.error("Failed to load seat data:", err);
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [isLoading, user, token, params.showtimeId]);

  const toggleSeat = (seatId: string) => {
    if (occupiedSeatIds.has(seatId)) return;
    
    setSelectedSeatIds(prev => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        next.add(seatId);
      }
      return next;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    const basePrice = Number(showtime?.basePrice || 0);
    
    selectedSeatIds.forEach(seatId => {
      const seat = seats.find(s => s.id === seatId);
      if (seat) {
        const section = sections.find(sec => sec.id === seat.sectionId);
        const addition = Number(section?.additionPrice || 0);
        total += basePrice + addition;
      }
    });
    return total;
  };

  const handleReserve = async () => {
    if (!token || !user || !showtime || selectedSeatIds.size === 0) return;
    
    setSubmitting(true);
    try {
      const basePrice = Number(showtime.basePrice || 0);
      const reservationSeats = Array.from(selectedSeatIds).map(seatId => {
        const seat = seats.find(s => s.id === seatId);
        const section = sections.find(sec => sec.id === seat?.sectionId);
        const addition = Number(section?.additionPrice || 0);
        return {
          seatId,
          price: basePrice + addition
        };
      });

      await createReservation(token, {
        userId: user.id,
        showTimeId: showtime.id,
        seats: reservationSeats
      } as any);

      router.push("/reservations");
    } catch (err) {
      console.error("Failed to create reservation:", err);
      alert("Failed to create reservation. Some seats might have just been taken.");
      setSubmitting(false);
    }
  };

  if (isLoading || loadingData) {
    return <div className="container mx-auto px-4 py-8">Loading seat map...</div>;
  }

  if (!showtime || !hall) {
    return <div className="container mx-auto px-4 py-8 text-red-600">Showtime not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
      <h1 className="text-3xl font-bold mb-6">Select Your Seats</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">{hall.name} - Screen</h2>
        <div className="w-3/4 mx-auto h-12 bg-gradient-to-b from-gray-300 to-transparent rounded-t-[50%] mb-12 relative flex items-center justify-center border-t-4 border-gray-400">
          <span className="text-gray-500 text-sm font-medium tracking-[0.3em] absolute top-2">SCREEN</span>
        </div>
        
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {sections.map(section => {
            const sectionSeats = seats.filter(s => s.sectionId === section.id).sort((a, b) => a.number - b.number);
            if (sectionSeats.length === 0) return null;

            return (
              <div key={section.id} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 text-center uppercase tracking-wider">
                  {section.name} ( +${section.additionPrice} )
                </h3>
                <div 
                  className="grid gap-2 justify-center mx-auto" 
                  style={{ gridTemplateColumns: `repeat(${section.columns || 10}, minmax(0, 1fr))`, maxWidth: `${(section.columns || 10) * 3}rem` }}
                >
                  {sectionSeats.map(seat => {
                    const isOccupied = occupiedSeatIds.has(seat.id);
                    const isSelected = selectedSeatIds.has(seat.id);
                    
                    let bgClass = "bg-gray-200 hover:bg-gray-300 border-gray-300";
                    if (isOccupied) bgClass = "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50";
                    else if (isSelected) bgClass = "bg-red-600 text-white border-red-700 hover:bg-red-700 shadow-sm";

                    return (
                      <button
                        key={seat.id}
                        disabled={isOccupied}
                        onClick={() => toggleSeat(seat.id)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-t-lg rounded-b-sm border-b-4 flex items-center justify-center transition-all ${bgClass}`}
                        title={`Seat ${seat.number}`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-12 pt-6 border-t">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 border-b-4 border-gray-300 rounded-t-lg rounded-b-sm"></div>
            <span className="text-sm text-gray-600 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 border-b-4 border-red-700 rounded-t-lg rounded-b-sm"></div>
            <span className="text-sm text-gray-600 font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-800 border-b-4 border-gray-900 rounded-t-lg rounded-b-sm opacity-50"></div>
            <span className="text-sm text-gray-600 font-medium">Occupied</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-md sticky bottom-4 border border-gray-100">
        <div className="mb-4 sm:mb-0">
          <p className="text-gray-600 mb-1">Selected Seats: <span className="font-semibold text-gray-900">{selectedSeatIds.size}</span></p>
          <p className="text-2xl font-bold">Total: ${calculateTotal().toFixed(2)}</p>
        </div>
        <Button 
          onClick={handleReserve}
          disabled={selectedSeatIds.size === 0 || submitting}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-lg px-8 py-6 h-auto shadow-lg"
        >
          {submitting ? "Reserving..." : "Reserve Seats"}
        </Button>
      </div>
    </div>
  );
}
