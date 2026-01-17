// models/Session.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    ipAddress: String,
    userAgent: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    lastUsedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Session", sessionSchema);
