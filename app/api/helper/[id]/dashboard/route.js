import { connectToDB } from "lib/db";
import Helper from "models/Helper";
import { NextResponse } from "next/server";



export async function GET(req ,{params}){
    try {
        await connectToDB();

        const {id} =params;
        const helper = await Helper.findById(id).lean();
        if(!helper){
            return NextResponse.json({message:"Helper not found"}, {status :404});

        }

        const jobCounts = {
            mechanic: 0,
            fuel :0,
            tow:0,
        };

        helper.completedJobs.forEach((job)=>{
            if(job.status ==="completed"){
                jobCounts[job.serviceType]++;
            }
        });

        const totalJobs = helper.completedJobs.length;
        const highestRating  = helper.ratings;

        return NextResponse.json({
            basicInfo:{
                name: helper.name,
                email:helper.email,
                phone: helper.phone,
                serviceType:helper.serviceType,
                location:helper.location,
            },totalEarnings :helper.totalEarnings,
            averageRating: helper.ratings?.toFixed(1),
            highestRating,
            totalJobs,
            jobBreakdown :jobCounts,

        })
       
    } catch (error) {
        console.error("Dashboard error:" ,error);
        return NextResponse.json({success:false , message:error.message , status :500});
        
    }
}