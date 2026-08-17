"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import MoviesTab from "./tabs/MoviesTab";
import GenresTab from "./tabs/GenresTab";
import HallsTab from "./tabs/HallsTab";
import SectionsTab from "./tabs/SectionsTab";
import SeatsTab from "./tabs/SeatsTab";
import ShowTimesTab from "./tabs/ShowTimesTab";
import ReservationsTab from "./tabs/ReservationsTab";
import ShowtimeAnalyticsTab from "./tabs/ShowtimeAnalyticsTab";

const TABS = [
  { id: "movies", label: "Movies" },
  { id: "genres", label: "Genres" },
  { id: "halls", label: "Halls" },
  { id: "sections", label: "Sections" },
  { id: "seats", label: "Seats" },
  { id: "showtimes", label: "Showtimes" },
  { id: "analytics", label: "Analytics" },
  { id: "reservations", label: "Reservations" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("movies");

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your cinema system resources</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-border px-4 sm:px-6 lg:px-8 overflow-x-auto bg-background">
        <div className="max-w-7xl mx-auto flex gap-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "movies" && <MoviesTab />}
        {activeTab === "genres" && <GenresTab />}
        {activeTab === "halls" && <HallsTab />}
        {activeTab === "sections" && <SectionsTab />}
        {activeTab === "seats" && <SeatsTab />}
        {activeTab === "showtimes" && <ShowTimesTab />}
        {activeTab === "analytics" && <ShowtimeAnalyticsTab />}
        {activeTab === "reservations" && <ReservationsTab />}
      </div>
    </div>
  );
}
