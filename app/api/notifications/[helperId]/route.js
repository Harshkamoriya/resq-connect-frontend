import { connectToDB } from "lib/db";
import Helper from "models/Helper";
import { NextResponse } from "next/server";
import Booking from "models/Booking";

export async function GET(req,{params}) {
  try {
    await connectToDB();
    console.log(params)

    const { helperId } = params;
    console.log("helper id",helperId);


    const helper = await Helper.findById(helperId)
      .populate("notifications.bookingId")
      .lean();

    if (!helper) {
      return NextResponse.json(
        { success: false, message: "Helper not found with this ID", status: 404 },
        { status: 404 }
      );
    }
const notifications = helper.notifications;
    return NextResponse.json({
      success: true,
      notifications,
      status: 200,
    });
  } catch (error) {
    console.log("Error fetching notifications:", error.message);
    return NextResponse.json(
      { success: false, message: error.message, status: 500 },
      { status: 500 }
    );
  }
}
