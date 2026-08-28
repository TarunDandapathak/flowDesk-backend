import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
        },

        otpHash: {
            type: String,
            required: [true, "OTP hash is required"],
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },

        expiresAt: {
            type: Date,
            required: [true,"Invalid OTP or OPT timeout" ],
        },
    },
    {
        timestamps: true,
    }
);

const otpModel = mongoose.model("OTP", otpSchema);

export default otpModel;