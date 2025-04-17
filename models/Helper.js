import mongoose from "mongoose";

const helperSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "helper"], required: true },
    phone: { type: String, required: true },
    serviceType: {
      type: String,
      enum: ["mechanic", "fuel", "tow"],
      required: true,
    },
    price: { type: Number },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: { type: [Number], required: true, index: "2dsphere" },
    },

    availability: { type: Boolean, default: true },

    completedJobs: [
      {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        serviceType: {
          type: String,
          enum: ["mechanic", "fuel", "tow"],
          required: true,
        },
        status: {
          type: String,
          enum: ["completed", "cancelled"],
          default: "completed",
        },
        finalPrice: { type: Number },
        location: {
          name: { type: String },
          latitude: { type: Number },
          longitude: { type: Number },
        },
        ratings: { type: Number, min: 1, max: 5 },
        review: { type: String },
        completionTime: { type: Date, default: Date.now },
      },
    ],

    totalEarnings: { type: Number, default: 0 },
    totalCompletedJobs: { type: Number, default: 0 },

    averageRating: { type: Number, default: 5 },

    reviews: [
      {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        review: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    notifications: [
      {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        message: String,
        seen: { type: Boolean, default: false },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Ensure the 2dsphere index is created
helperSchema.index({ location: "2dsphere" });

const Helper =
  mongoose.models.Helper || mongoose.model("Helper", helperSchema);
export default Helper;
