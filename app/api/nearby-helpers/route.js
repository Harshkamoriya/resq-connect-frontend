import { connectToDB } from "lib/db";
import Helper from "models/Helper";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat"));
    const lon = parseFloat(searchParams.get("lon"));
    const serviceType = searchParams.get("serviceType")?.toLowerCase();

    console.log("Received Params:", { lat, lon, serviceType });

    if (!lat) return NextResponse.json({ success: false, message: "Latitude is missing", status: 400 });
    if (!lon) return NextResponse.json({ success: false, message: "Longitude is missing", status: 400 });
    if (!serviceType) return NextResponse.json({ success: false, message: "ServiceType is missing", status: 400 });

    await connectToDB();

    // Fetch helpers based on service type, availability, and proximity (5km)
    const helpers = await Helper.find({
      serviceType,
      availability: true, // Only fetch available helpers
      "location.coordinates": {
        $near: {
          $geometry: { type: "Point", coordinates: [lon, lat] },
          $maxDistance: 5000, // 5km
        },
      },
    });

    console.log("Filtered Helpers:", helpers);
    console.log("Coordinates of helpers found:", helpers.map(h => h.location.coordinates));

    return NextResponse.json({
      success: true,
      message: "Fetched helpers within a 5km radius successfully",
      status: 200,
      helpers,
    });

  } catch (error) {
    console.error("Error fetching helper data:", error.message);
    return NextResponse.json({ success: false, message: error.message, status: 500 });
  }
}
