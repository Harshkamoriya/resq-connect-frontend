import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    password: {
      type: String,
      required: function () {
        return this.provider === "credentials";
      },
    },

    role: {
      type: String,
      enum: ["customer", "helper"],
      default: "customer",
    },

    phone: {
      type: String,
      required: function () {
        return this.provider === "credentials";
      },
    },

    location: {
      name: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },

    profileImage: { type: String, default: "" },

    servicesBooked: [
      {
        serviceType: {
          type: String,
          enum: ["mechanic", "fuel", "tow"],
          required: true,
        },
        helper: { type: mongoose.Schema.Types.ObjectId, ref: "Helper" },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        status: {
          type: String,
          enum: ["pending", "completed", "cancelled"],
          default: "pending",
        },
        estimatedPrice: { type: Number, required: true },
        finalPrice: { type: Number },
        distance: { type: Number }, // in km
        requestTime: { type: Date, default: Date.now },
        completionTime: { type: Date },
      },
    ],

    totalMoneySpent: { type: Number, default: 0 },

    provider: {
      type: String,
      enum: ["credentials", "google"],
      required: true,
    },

    ratingsGiven: [
      {
        helper: { type: mongoose.Schema.Types.ObjectId, ref: "Helper" },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
