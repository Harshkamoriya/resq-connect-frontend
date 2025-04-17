export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
  
    if (!query) {
      return new Response(JSON.stringify({ error: "Query parameter is required" }), { status: 400 });
    }
  
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
        {
          headers: { "User-Agent": "your-app-name" }, // Important: Add a valid User-Agent
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch location");
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  