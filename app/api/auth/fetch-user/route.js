import User from "models/User";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { connectToDB } from "lib/db";


export async function GET(req) {
     await connectToDB();
     const session = await getServerSession(authOptions);
    
      if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      
    try {
        const user = await User.findOne({email:session.user.email})
        if(!user){
            return NextResponse.json({success:false ,message: "user data not found" , status:200})

        }

        return NextResponse.json({success:true , message:"user data found successfully" , status:200 , user})
    } catch (error) {
        console.error("error fetching the user data" , error.message)
        return NextResponse.json({success:false , message:error.message , status:500})

        
    }
    
}