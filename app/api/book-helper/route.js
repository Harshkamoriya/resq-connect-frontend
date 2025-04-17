import { connectToDB } from "lib/db";
import Booking from "models/Booking";
import { NextResponse } from "next/server";
import { sendEmailOTP } from "lib/mailer"; // <- new
import Helper from "models/Helper";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userEmail, helperId, issueDescription, location,email} = body;
     console.log(userEmail , " userid")
     console.log(helperId, "helperid");
    await connectToDB();

     // ✅ Get price from helper
     const helper = await Helper.findById(helperId);
     if (!helper) {
       return NextResponse.json({ success: false, message: "Helper not found" });
     }
 
     const amount = helper.price;
     const serviceType = helper.serviceType;

    const userOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const endOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const booking = await Booking.create({
      userEmail,
      helperId,
      issueDescription,
      location,
      userOtp,
      endOtp,
      amount,
      serviceType
    });

    console.log(booking , "booking data")

    await sendEmailOTP(email, userOtp); // sending OTP via email

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      bookingId: booking._id,
      bookingData : booking
    });
  } catch (error) {
    console.error("Error booking helper and sending OTP:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
