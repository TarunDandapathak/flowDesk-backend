import userModel from "../models/auth.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../service/email.service.js";
import { otpGenerator, getOtpHtml } from "../utils/otp.utils.js";
import otpModel from "../models/otp.model.js";


dotenv.config();

const saltRounds = 10; 



// register

async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            if (existingUser.verified) {
                return res.status(400).json({ message: "Email already registered" });
            }
            // Optional: Delete existing unverified user to let them re-register
            await userModel.deleteOne({ _id: existingUser._id });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword,

        });

        // Generate & Hash OTP (Valid for 5 mins)
        const otp = otpGenerator();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const hashedOtp = await bcrypt.hash(otp, saltRounds);

        // Delete existing unused OTPs for this email
        await otpModel.deleteMany({ email });

        await otpModel.create({
            user: user._id,
            email,
            expiresAt,
            otpHash: hashedOtp
        });

        const html = getOtpHtml(otp);
        await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html);

        return res.status(201).json({
            success: true,
            message: "Registration successful. OTP sent to your email."
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

// 2. VERIFY OTP (Completes Auth & Issues JWT)
async function otpVerification(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const otpData = await otpModel.findOne({ email });
        if (!otpData) {
            return res.status(400).json({ message: "OTP expired or not found" });
        }

        // Check expiration
        if (new Date() > new Date(otpData.expiresAt)) {
            await otpModel.deleteOne({ _id: otpData._id });
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        // Compare Hash
        const isOtpCorrect = await bcrypt.compare(String(otp), otpData.otpHash);
        if (!isOtpCorrect) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Mark user verified
        const user = await userModel.findByIdAndUpdate(
            otpData.user,
            { verified: true },

        );

        // Clean up used OTPs
        await otpModel.deleteMany({ user: otpData.user });

        // Issue JWT Token upon successful verification
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
        );

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            
        });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

// login

async function loginUser(req, res) {
    try {

        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }



        // If password has select:false in schema, use .select("+password")
        const user = await userModel.findOne({ email });
        // console.log(user);

        if (!user) {
            return res.status(404).json({
                message: "Email is not found"
            });
        }
        if (!user.verified) {
            return res.status(401).json({
                message: "email is not verified"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "15m"
            }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                // id: user._id,
                fullName: user.fullName,
                email: user.email,
                accessToken
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

//logout

async function logoutUser(req, res) {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path:"/"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// otp varification 
// async function otpVerification(req, res) {
//     try {
//         const { email, otp } = req.body;

//         const otpData = await otpModel.findOne({ email });

//         if (!otpData) {
//             return res.status(400).json({
//                 message: "OTP expired or not found"
//             });
//         }

//         const isOtpCorrect = await bcrypt.compare(
//             otp,
//             otpData.otpHash
//         );

//         if (!isOtpCorrect) {
//             return res.status(400).json({
//                 message: "Invalid OTP"
//             });
//         }

//         await userModel.findByIdAndUpdate(
//             otpData.user,
//             {
//                 verified: true
//             }
//         );

//         await otpModel.deleteMany({
//             user: otpData.user
//         });

//         res.status(200).json({
//             success: true,
//             message: "Email verified successfully"
//         });

//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         });
//     }
// }
export default {
    registerUser,
    otpVerification,
    loginUser,
    logoutUser
};