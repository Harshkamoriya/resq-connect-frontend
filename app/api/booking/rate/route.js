import { connectToDB } from "lib/db";
import Booking from "models/Booking";
import Helper from "models/Helper";
import User from "models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { bookingId, rating, review } = body;

    if (!bookingId || !rating) {
      return NextResponse.json({
        success: false,
        message: "bookingId and rating are required",
        status: 400,
      });
    }

    await connectToDB();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({
        success: false,
        message: "Booking not found",
        status: 404,
      });
    }

    // Update Booking with rating/review/status
    booking.rating = rating;
    booking.review = review;
    booking.paymentStatus = "Paid";
    booking.workStatus = "completed";
    await booking.save();

    // Update Helper
    const helper = await Helper.findById(booking.helperId);
    if (helper) {
      helper.completedJobs.push({
        bookingId: booking._id,
        customer: booking.userId,
        serviceType: booking.serviceType,
        status: "completed",
        finalPrice: booking.amount,
        location: booking.locationDetails,
        ratings: rating,
        review: review,
        completionTime: new Date(),
      });

      helper.totalCompletedJobs += 1;
      helper.totalEarnings += booking.amount || 0;

      // Optionally: update averageRating
      const totalRatings = helper.completedJobs.reduce(
        (acc, job) => acc + (job.ratings || 0),
        0
      );
      helper.averageRating =
        helper.completedJobs.length > 0
          ? totalRatings / helper.completedJobs.length
          : rating;

      // Optional: store review
      helper.reviews.push({
        customer: booking.userId,
        rating,
        review,
      });

      await helper.save();
    }

    // Update User
    const user = await User.findOne({email: booking.userEmail});
    if (user) {
      user.bookingHistory.push({
        bookingId: booking._id,
        helperId: booking.helperId,
        serviceType: booking.serviceType,
        location: booking.locationDetails,
        amount: booking.amount,
        status: booking.bookingStatus,
        rating,
        review,
        createdAt: new Date(),
      });

      user.totalMoneySpent += 1;

      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Rating, review and status saved successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Rating error", error.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
}
