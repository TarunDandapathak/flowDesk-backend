import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Name is required"],
            minlength: 1,
            maxlength: 20,
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 4,

        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;