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

    bookingHistory: [
      {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        helperId: { type: mongoose.Schema.Types.ObjectId, ref: "Helper" },
        serviceType: String,
        location: {
          name: String,
          latitude: Number,
          longitude: Number,
        },
        amount: Number,
        status: String,
        rating: Number,
        review: String,
        createdAt: { type: Date, default: Date.now },
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
