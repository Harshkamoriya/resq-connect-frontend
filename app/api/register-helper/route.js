import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDB } from "lib/db";
import Helper from "models/Helper";

export async function POST(req) {
  try {
    // Get th
    const body = await req.json();
    const { name, phone, serviceType, location, availability, password } = body;

    await connectToDB();

    // Use session.user.email to check if helper already exists
    const existingHelper = await Helper.findOne({ email: session.user.email });
    if (existingHelper) {
      return NextResponse.json(
        { success: false, message: "Helper already exists" },
        { status: 400 }
      );
    }

    // Hash password if provided, else use placeholder (e.g., if signed in via Google)
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : "GOOGLE";

    // Create the new helper using session data when available
    const newHelper = new Helper({
      name: name || session.user.name,
      email: session.user.email,
      password: hashedPassword,
      role: "helper",
      phone,
      serviceType,
      location,
      availability,
    });

    await newHelper.save();

    return NextResponse.json({
      success: true,
      message: "Helper registered successfully",
      helper: newHelper,
    });
  } catch (error) {
    console.error("Error registering helper:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
