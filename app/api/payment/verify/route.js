import { NextResponse } from "next/server";
import crypto from 'crypto';



export async function POST(req) {

    const body = await req.json();
    const { razorpay_order_id , razorpay_payment_id , razorpay_signature } = body;
    const sign  = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign)
    .digest("hex");

    if(expectedSignature === razorpay_signature){

        return NextResponse.json({success:true });

    }else{
        return new NextResponse('INvalid signature',{status :400})
    }
    
}