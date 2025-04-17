import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        console.log("req.url",req.url);


        const userLat = parseFloat(searchParams.get("userLat"));
        console.log(userLat,"userLat");

        const userLon = parseFloat(searchParams.get("userLon"));
        console.log(userLon,"userLon");

        const helperLat = parseFloat(searchParams.get("helperLat"));
        console.log(helperLat,"helperLat");

        const helperLon = parseFloat(searchParams.get("helperLon"));
        console.log("helperLon", helperLon);

        // Validate coordinates
        if (isNaN(userLat) || isNaN(userLon) || isNaN(helperLat) || isNaN(helperLon)) {
            return NextResponse.json({
                success: false,
                message: "Invalid or missing coordinates",
                status: 400,
            });
        }

        const apiKey = process.env.ETA_KEY;
        console.log("apikey",apiKey)
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${userLon},${userLat}&end=${helperLon},${helperLat}`;

        console.log("Fetching ETA from URL:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        console.log("response " , response);

        const data = await response.json();

        console.log("data is coming  ", data);
        // console.log("API Response:", JSON.stringify(data, null, 2));

        // if (!response.ok || !data.routes || data.routes.length === 0) {
        //     return NextResponse.json({
        //         success: false,
        //         message: data.error?.message || "No routes found. Check API response.",
        //         status: response.status || 400,
        //     });
        // }

        const distanceInMeters = data.features[0].properties.segments[0].distance;
        console.log("distance in metres", distanceInMeters)
        const distanceInKm = (distanceInMeters / 1000).toFixed(2); // e.g., "2.19"
        console.log("distance in km ", distanceInKm)

        const durationInSeconds = data.features[0].properties.segments[0].duration;
        console.log(durationInSeconds,"duration in seconds")

        const etaInMinutes = Math.ceil(durationInSeconds / 60); // round up to nearest minute
        console.log("eta in minutes", etaInMinutes)

        const seconds = Math.round(durationInSeconds % 60);
        console.log("eta in seconds",seconds);

        const etaFormatted = `${etaInMinutes} min ${seconds} sec`;
        console.log(etaFormatted);
        
        return NextResponse.json({success:true, message:" Eta and distance fetched succesfully ", status:200 ,distanceInKm,etaFormatted ,durationInSeconds })





        console.log("after the checking the response")
        const distance = (data.routes[0].summary.distance / 1000).toFixed(2); // km
        console.log("distance",distance)
        const eta = Math.round(data.routes[0].summary.duration / 60); // minutes
        console.log("eta",eta);
        return NextResponse.json({
            success: true,
            message: "ETA data fetched successfully",
            status: 200,
            distance,
            eta,
        });

    } catch (error) {
        console.error("Unexpected error fetching ETA:", error.message);
        return NextResponse.json({
            success: false,
            message: error.message,
            status: 500,
        });
    }
}
