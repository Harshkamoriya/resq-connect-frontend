import { connectToDB } from "lib/db";
import Helper from "models/Helper";
import User from "models/User";
import Booking from "models/Booking";
import { NextResponse } from "next/server";
import Helper from "models/Helper";

export async function GET(req, context) {
  await connectToDB();

  const { bookingId } = context.params;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }
    console.log(booking ,"bookingData")

    // ✅ FIX: No need to validate ObjectId — userId is a Google ID (string)
    const user = await User.findOne({ email: booking.userEmail }).select("name phone location");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      bookingId: booking._id,
      workStatus: booking.workStatus,
      location: booking.location,
      issueDescription: booking.issueDescription,
      serviceType: booking.serviceType,
      user: {
        name: user.name,
        phone: user.phone,
        location: user.location,
      },
      priceToPay: 199,
      success: true,
      message: "User data fetched successfully",
      status: 200,
      createdAt: booking.createdAt,
      booking,
    });
  } catch (error) {
    console.error("Error fetching booking info:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Internal Server Error",
      status: 500,
    });
  }
}
