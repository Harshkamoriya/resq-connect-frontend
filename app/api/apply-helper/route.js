import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Helper from "models/Helper";

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

    await Helper.create({
      name: session.user.name,
      email: session.user.email,
      password: "GOOGLE",
      phone,
      role: "helper",
      serviceType,
      price,
      location: {
        type: "Point",
        coordinates,
      },
    });

    return NextResponse.json({ message: "Helper application successful" }, { status: 201 });
  } catch (err) {
    console.error("Helper registration error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
