// app/api/helper/[helperId]/toggle-availability/route.js

import { connectToDB } from "lib/db";
import Helper from "models/Helper";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    console.log(params);

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Helper ID is required" },
        { status: 400 }
      );
    }

    const helper = await Helper.findById(id);
    if (!helper) {
      return NextResponse.json(
        { success: false, message: "Helper not found" },
        { status: 404 }
      );
    }

    helper.availability = !helper.availability;
    await helper.save();

    return NextResponse.json(
      {
        success: true,
        message: "Availability toggled successfully",
        availability: helper.availability,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling availability:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
