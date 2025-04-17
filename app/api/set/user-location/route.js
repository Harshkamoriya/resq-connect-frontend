import { connectToDB } from "lib/db";
import User from "models/User";
import { NextResponse } from "next/server";

export async function PUT(req) {
  await connectToDB();

  try {
    const body = await req.json();
    const { location, email } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found", status: 400 });
    }

    user.location = {
      name: location.name,
      latitude: location.lat,
      longitude: location.lon,
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message: "User location updated successfully",
      status: 200,
    });
  } catch (error) {
    console.log("Error updating user location:", error.message);
    return NextResponse.json({ success: false, message: error.message, status: 500 });
  }
}
