"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { getReservations } from "@/services/reservations.service";
import { getMovies } from "@/services/movies.service";
import { getShowTimes } from "@/services/showtimes.service";
import { getHalls } from "@/services/halls.service";
import type { Reservation } from "@/dto/reservation.dto";
import type { Movie } from "@/dto/movie.dto";
import type { ShowTime } from "@/dto/showTime.dto";
import type { Hall } from "@/dto/hall.dto";

function getInitials(name?: string, email?: string) {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email?.slice(0, 2).toUpperCase() ?? "??";
}

export default function ProfilePage() {
  const { user, isLoading, logout, accessToken: token } = useAuth();
  const router = useRouter();

  const [upcoming, setUpcoming] = useState<Reservation[]>([]);
  const [history, setHistory] = useState<Reservation[]>([]);
  const [movies, setMovies] = useState<Record<string, Movie>>({});
  const [showtimes, setShowtimes] = useState<Record<string, ShowTime>>({});
  const [halls, setHalls] = useState<Record<string, Hall>>({});
  const [loadingData, setLoadingData] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (isLoading || !user || !token) return;

    async function loadData() {
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
        console.error("Failed to fetch profile reservations", err);
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [isLoading, user, token]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  const renderReservation = (res: Reservation) => {
    const showtime = showtimes[res.showTimeId];
    const movie = showtime ? movies[showtime.movieId] : null;
    const hall = showtime ? halls[showtime.hallId] : null;
    const seatCount = res.seats?.length || 0;
    const date = showtime ? new Date(showtime.showTimeStart) : null;

    return (
      <div key={res.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b last:border-0 gap-4">
        <div>
          <h4 className="font-bold">{movie?.title || "Unknown Movie"}</h4>
          <p className="text-sm text-gray-500">
            {date ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "-"} at {date ? date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : "-"}
          </p>
          <p className="text-sm text-gray-500">
            {hall?.name || "Unknown Hall"} • {seatCount} Ticket{seatCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href={`/reservations/${res.id}`}>
          <Button variant="outline" size="sm">View Ticket</Button>
        </Link>
      </div>
    );
  };

  return (
    <div className="container max-w-4xl py-10 mx-auto">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <Card className="w-full md:w-1/3">
          <CardHeader className="text-center flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarFallback className="text-2xl bg-red-100 text-red-600">
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{user.name ?? "User"}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-gray-400">
              {user.role}
            </p>
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Sign Out
            </Button>
          </CardHeader>
        </Card>
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="tickets">My Tickets</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tickets" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Reservations</CardTitle>
                  <CardDescription>
                    Your upcoming movie reservations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="text-center text-gray-500 py-8">Loading...</div>
                  ) : upcoming.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No upcoming reservations found.
                      <div className="mt-4">
                        <Link href="/movies">
                          <Button variant="link" className="text-red-600">Browse Movies &rarr;</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {upcoming.map(renderReservation)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Past Reservations</CardTitle>
                  <CardDescription>Your movie viewing history.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="text-center text-gray-500 py-8">Loading...</div>
                  ) : history.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No past reservations found.
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {history.map(renderReservation)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
