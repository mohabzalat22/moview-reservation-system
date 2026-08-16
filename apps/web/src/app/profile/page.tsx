"use client";

import { useEffect } from "react";
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
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

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
                    Your upcoming movie reservations will appear here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-500 py-8">
                    No upcoming reservations found.
                  </div>
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
                  <div className="text-center text-gray-500 py-8">
                    No past reservations found.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
