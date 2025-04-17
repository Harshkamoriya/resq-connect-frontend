import { connectToDB } from "lib/db";
import Booking from "models/Booking";
import { NextResponse } from "next/server";



export async function POST(req) {

    try {
        await connectToDB();

        const {bookingId, otp} = await req.json();
        console.log(bookingId ,otp , " booking id  and otp")

        const  booking   = await Booking.findById(bookingId);
        if(!booking){
            console.log("booking not found in the database by this id");
            return NextResponse.json({success:false  , message:"Booking not Found by this id", status:404});

        }
        console.log(booking , "booking data");
        console.log(booking.userOtp);

        if (String(booking.userOtp).trim() === String(otp).trim()) {
            booking.bookingStatus = "confirmed";
            booking.userOtp = null;
            await booking.save();
        
            return NextResponse.json({
                success: true,
                message: "Booking confirmed. Your helper will arrive shortly.",
                status: 201,
                bookingData: booking,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "OTP did not match. Please try again.",
                status: 400,
            });
        }
        
    } catch (error) {
        console.log("Error verifying otp " , error.message);
        return NextResponse.json({success:false , message:error.message , status :500})
        
    }
    
}