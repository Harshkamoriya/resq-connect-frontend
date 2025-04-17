import { connectToDB } from "lib/db";
import Helper from "models/Helper";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectToDB(); // optional, if not connected globally

  const { helperId } = params
  console.log("in the helperInfo fetching function")


  try {
    const helper = await Helper.findById(helperId).select("-password"); // exclude password if exists
    console.log(helper,"helper");

    if (!helper) {
      return NextResponse.json(
        { success: false, message: "Helper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Helper found", data: helper },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching helper:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
