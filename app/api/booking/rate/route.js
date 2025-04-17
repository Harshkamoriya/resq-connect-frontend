import { connectToDB } from "lib/db";
import Booking from "models/Booking";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        const body = await req.json();
        console.log(body ,"body ")
        const {bookingId , rating  , review} = body;
        console.log(bookingId , rating , review , "rating and reviewa and bookingId")

        if(!bookingId || !rating ){
            return NextResponse.json({success:false  , message:"bookingId and rating are required" , status:400});

        }
        await connectToDB();
        const booking   = await Booking.findById(bookingId);
        if(!booking){
            return NextResponse.json({success:false , message: "booking not found" , status :404})

        }

        booking.rating  = rating;
        booking.review = review;
        booking.paymentStatus = "Paid"

        await booking.save();
        return NextResponse.json({
            success:true , message: "Ratings and reviews saved",
            status:200
        });

    } catch (error) {
        console.error("Rating error " , error.message)
        return NextResponse.json({success:false , message:"Internal server error ", status :500})

    }
    
}