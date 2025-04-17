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
  
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }
  
      const data = await response.json();
  
      return Response.json(
        { success: true, message: "Data fetched successfully", address: data.display_name },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching the current location:", error.message);
      return Response.json(
        { success: false, message: error.message },
        { status: 500 } // Set HTTP 500 for internal server errors
      );
    }
  }
  