import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
  userEmail: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  helperId: { type: mongoose.Schema.Types.ObjectId, ref: "Helper", required: true },

  issueDescription: String,
  amount: Number,

  userOtp: String,   // For user confirmation
  endOtp: String,    // For starting ride by helper

  bookingStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },

  workStatus: {
    type: String,
    enum: ["not-started", "in-progress", "completed"],
    default: "not-started",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },

  razorpay_payment_id: String,

  // Location details for tracking or historical logs
  locationDetails: {
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },

  // User feedback
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },

  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
