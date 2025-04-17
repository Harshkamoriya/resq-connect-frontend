import { connectToDB } from "lib/db";
import Booking from "models/Booking";
import Helper from "models/Helper";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();

    // ✅ Fix: use await req.json()
    const body = await req.json();

    const bookingId = body.bookingId; // ✅ match frontend structure
    const booking = await Booking.findById(bookingId); // ✅ fix missing await

    if (!booking) {
      return NextResponse.json({
        success: false,
        message: "Booking not found",
        status: 404,
      });
    }

    const helperId = booking.helperId;
    const helper = await Helper.findOne({ _id: helperId })
    if (!helper) {
      return NextResponse.json({
        success: false,
        message: "Helper not found",
        status: 404,
      });
    }

    const notification = {
      bookingId: booking._id,
      message: `New request from user ${booking.userId} - ${booking.issueDescription}`,
    };

    helper.notifications.unshift(notification);
    await helper.save();

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      notification,
      status: 200,
    });
  } catch (error) {
    console.error("Error in sending notifications:", error.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
}
