import { useSession } from "next-auth/react";
import { authOptions } from "../[...nextauth]/route";
import { connectToDB } from "lib/db";
import User from "models/User";
import { NextResponse } from "next/server";
export async function POST(req) {
    await connectToDB();
    const session = await getServerSession(authOptions);
        
          if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
          }
    try {
        const {phone}= req.json();
        const user = await User.findOne({email:session.user.email});
        if(!user){
            return NextResponse.json({suceess:false  , message: "user not found"  , status:404});
        }
        user.phone = phone;
        await user.save();
        return NextResponse.json({success:true  , message: "user phone registered successfully" , status:201});
      
        
    } catch (error) {
            console.error(error.message  , "error registering the user");
            return NextResponse.json({success:false , message:error.message  , status:500});
        
    }
    
}