import { connectToDB } from "lib/db";
import Helper from "models/Helper";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        await connectToDB();
        const helpers = await Helper.find({});

        if( !helpers){
            return NextResponse.json({success:false , message:"helpers not found " ,status:404})
        }
      


        return NextResponse.json({success:true , message: "Helpers data fetched successfully " ,status:200 , helpers})
    } catch (error) {
    console.error("error fetching Helpers " , error.message);
    return NextResponse.json({success:false , message : error.message , status :500});
    }

}