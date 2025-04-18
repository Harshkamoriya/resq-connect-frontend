import { connectToDB } from "lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { NextResponse } from "next/server";
import Helper from "models/Helper";
import User from "models/User";

export async function GET(req) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    console.log(session)

    if (!session) {
      console.log("session not found");
      return NextResponse.json(
        { success: false, message: "session not found" },
        { status: 404 }
      );
    }

    const helperEmail = session.user.email;

    if (!helperEmail) {
      console.log("helperEmail not found");
      return NextResponse.json(
        { success: false, message: "helperEmail not found" },
        { status: 404 }
      );
    }

    const helper = await Helper.findOne({ email: helperEmail }); // ✅ use await

    if (!helper) {
      console.log("helper not found");
      return NextResponse.json(
        { success: false, message: "helper not found" },
        { status: 404 }
      );
    }
      const user = User.findOne({email : helperEmail});
      if(!user ){
        return NextResponse.json({success:false , message:" user not found by the help of helperEmail" ,status :404});
      }
    return NextResponse.json({
      success: true,
      message: "Helper and session fetched successfully",
      session,
      user,
      helperId: helper._id, // or return full helper if needed
    });
  } catch (error) {
    console.log("error fetching session and helper:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
