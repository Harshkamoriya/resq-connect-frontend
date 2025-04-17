import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { NextResponse } from "next/server";




export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({success:false , message:"session not found ", status :404})

        }
        return NextResponse.json({success:true , message: " session fetched successsfully" ,status :200 , session});
    } catch (error) {
        console.log("error fetching session" , error.message)
        return NextResponse.json({success:false , message:error.message , status :500})
        
    }
    
}