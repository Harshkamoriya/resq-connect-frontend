import { Currency, Receipt } from "lucide-react";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
    console.log(" in the backend of create order")
    const body  = await req.json();
    console.log(body , "body of the request")

    console.log(process.env.RAZORPAY_KEY_ID, "razorpay Id")
    console.log(process.env.RAZORPAY_SECRET, "razorpay secret")

    const razorpay  = new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_SECRET,
    });
     console.log("options before")
    
    const options = {
        amount :body.amount *100,
        currency:'INR',
        receipt:body.receipt,
        
    };


    try {
        const order = await razorpay.orders.create(options);
        console.log(order , "order in the backedn")
        return NextResponse.json(order);
    } catch (error) {
        console.error(error,"error fetching order ");
        return new NextResponse('Order creation failed', {status:500});
        
    }
    
}