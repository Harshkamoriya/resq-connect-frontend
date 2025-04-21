import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Helper from "models/Helper";
import User from "models/User";
import { connectToDB } from "lib/db";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();

  const { phone, serviceType, coordinates, price } = await req.json();

  if (!phone || !serviceType || !coordinates || !price) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  try {
    const existing = await Helper.findOne({ email: session.user.email });

    if (existing) {
      return NextResponse.json({ message: "You're already a helper" }, { status: 409 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.role = "helper";
    await user.save();

    await Helper.create({
      name: session.user.name,
      email: session.user.email,
      password: null,
      phone,
      role: "helper",
      serviceType,
      price,
      location: {
        type: "Point",
        coordinates,
      },
    });

    const helper = await Helper.findOne({ email: session.user.email });

    return NextResponse.json(
      {
        message: "Helper application successful",
        helper,
        user,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Helper registration error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
