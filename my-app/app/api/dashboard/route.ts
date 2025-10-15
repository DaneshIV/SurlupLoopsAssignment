import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import TimeSlot from "@/models/TimeSlot";

export async function GET() {
  try {
    await connectToDatabase();

    const [totalBookings, pendingSlots, todayBookings] = await Promise.all([
      Booking.countDocuments({}),
      TimeSlot.countDocuments({ isBooked: false }),
      Booking.countDocuments({
        date: { $regex: new Date().toISOString().split("T")[0] },
      }),
    ]);

    const recentBookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        pendingSlots,
        todayBookings,
        recentBookings,
      },
    });
  } catch (error) {
    console.error("❌ Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
