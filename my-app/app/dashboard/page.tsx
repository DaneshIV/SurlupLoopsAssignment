"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Calendar = dynamic(() => import("@/components/ui/calendar").then((mod) => mod.Calendar), {
  ssr: false,
});

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // ✅ Auto-refresh every 5 seconds
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (data.success) setDashboard(data.data);
      } catch (err) {
        console.error("❌ Dashboard fetch error:", err);
      }
    };

    fetchDashboard(); // initial load
    const interval = setInterval(fetchDashboard, 5000); // 🔁 refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  if (!dashboard)
    return <p className="p-6 text-muted-foreground">Loading dashboard...</p>;

  const { totalBookings, pendingSlots, todayBookings, recentBookings } = dashboard;

  return (
    <motion.div
      layout
      transition={{ duration: 0.3 }}
      className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(350px,1fr))] items-start p-6"
    >
      {/* Quick Stats */}
      <Card className="rounded-lg h-auto">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <motion.div layout transition={{ duration: 0.3 }}>
            <p>
              Total Bookings:{" "}
              <span className="font-semibold">{totalBookings}</span>
            </p>
            <p>
              Available Slots:{" "}
              <span className="font-semibold">{pendingSlots}</span>
            </p>
            <p>
              Today’s Bookings:{" "}
              <span className="font-semibold">{todayBookings}</span>
            </p>
          </motion.div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card className="rounded-lg h-auto 2xl:col-span-2">
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length > 0 ? (
            <ul className="space-y-2">
              {recentBookings.map((b: any) => (
                <li key={b._id} className="flex justify-between border-b pb-2">
                  <span>{b.clientName || "Guest"}</span>
                  <span>{b.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No bookings yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="rounded-lg h-auto">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
        </CardContent>
      </Card>

      {/* Add Booking */}
      <Card className="p-4 rounded-lg flex items-center justify-center">
        <Button>Add New Booking</Button>
      </Card>
    </motion.div>
  );
}
