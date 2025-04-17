import Booking from "models/Booking";
import { connectToDB } from "lib/db";
import { NextResponse } from "next/server";

// You must accept the second param { params }
export async function PUT(req, { params }) {
  await connectToDB();

  try {
    const { bookingId } = params;
    const {workStatus}  =  await req.json();

    if (!bookingId) {
      console.log("Booking ID is not present");
      return NextResponse.json({ success: false, message: "Booking ID is required", status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    console.log(booking,"booking of that bookingId")

    if (!booking) {
      console.log("Booking not found");
      return NextResponse.json({ success: false, message: "Booking not found", status: 404 });
    }

    // ✅ Update workStatus
    booking.workStatus = typeof workStatus === "string" ? workStatus : workStatus?.workStatus;

    // ✅ Save the updated booking
    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Booking workStatus updated to completed",
      booking,
      workStatus : booking.workStatus,
      status: 200,
    });

  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
      status: 500,
    });
  }
}
