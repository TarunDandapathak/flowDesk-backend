import jwt from "jsonwebtoken";

const verifyLogin = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        // console.log("Cookies:", req.cookies);
        console.log("Token:", token);
        // console.log(req);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        // console.log("DECODED:", decoded);

        req.user = decoded;

        next();

    } catch (error) {
        // console.log("JWT ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default verifyLogin;
