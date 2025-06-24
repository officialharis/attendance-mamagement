import jwt from "jsonwebtoken";

export const authAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if this is the hardcoded admin
        if (
            decoded.role !== "admin" ||
            decoded.id !== "admin" ||
            decoded.email !== process.env.ADMIN_EMAIL
        ) {
            return res.status(403).json({ success: false, message: "Access denied: Admin only" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
    }
};
