import { connectToDB } from "lib/db";
import Booking from "models/Booking";
import { NextResponse } from "next/server";


export async function GET(req){

    try {
        await connectToDB();
        const bookings = await Booking.find({});
        return NextResponse.json({success:true , message:"Bookings data fetched successfully", status:200 , bookings})
    } catch (error) {
        return NextResponse.json({success:false , message:error.message , status :500})
    }
}