export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return Response.json(
        { success: false, message: "Latitude and Longitude are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

    const response = await fetch(googleUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch address from Google Maps API");
    }

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(data.error_message || "Google Maps API Error");
    }

    const address = data.results[0]?.formatted_address || "Unknown Location";

    return Response.json(
      {
        success: true,
        message: "Address fetched successfully",
        address,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching the current location:", error.message);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
