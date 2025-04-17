import { connectToDB } from "lib/db";
import Booking from "models/Booking";
import Helper from "models/Helper";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectToDB();

        const { helperId, bookingId, action } = await req.json(); // await here
        console.log(helperId);

        const helper = await Helper.findById(helperId);
        if (!helper) {
            return NextResponse.json({
                success: false,
                status: 404,
                message: "Helper not found",
            });
        }

        const notification = helper.notifications.find(
            (note) => note.bookingId.toString() === bookingId
        );

        if (!notification) {
            return NextResponse.json({
                success: false,
                message: "Notification not found",
                status: 404,
            });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({
                success: false,
                message: "Booking not found",
                status: 404,
            });
        }

        if (action === "accept") {
            booking.bookingStatus = "confirmed";
            booking.workStatus = "in-progress";
            notification.status = "accepted";
        } else {
            booking.bookingStatus = "cancelled";
            notification.status = "rejected";
        }

        await booking.save(); // fix this line
        await helper.save();

        return NextResponse.json({
            success: true,
            message: `Booking ${action}ed.`,
        });
    } catch (error) {
        console.log("error accepting request", error.message);
        return NextResponse.json({
            success: false,
            message: error.message,
            status: 500,
        });
    }
}
