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
    if (!session) {
      return NextResponse.json(
        { success: false, message: "session not found" },
        { status: 404 }
      );
    }

    const helperEmail = session.user.email;
    if (!helperEmail) {
      return NextResponse.json(
        { success: false, message: "helperEmail not found" },
        { status: 404 }
      );
    }

    const helper = await Helper.findOne({ email: helperEmail }).lean();
    if (!helper) {
      return NextResponse.json(
        { success: false, message: "helper not found" },
        { status: 404 }
      );
    }

    const user = await User.findOne({ email: helperEmail }).lean();
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "user not found by the help of helperEmail",
        status: 404,
      });
    }

    const plainSession = JSON.parse(JSON.stringify(session));

    return NextResponse.json({
      success: true,
      message: "Helper and session fetched successfully",
      session: plainSession,
      user,
      helperId: helper._id,
    });
  } catch (error) {
    console.log("error fetching session and helper:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
