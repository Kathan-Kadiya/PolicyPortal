// import User from "../models/user.model.js";


// export const generateAccessAndRefreshToken = async (userId) => {
//     try {
//         const user = await User.findById(userId);
//         const accessToken = await user.generateAccessToken();
//         const newRefreshToken = await user.generateRefreshToken();

//         // Save the refresh token in the database
//         user.refreshToken = newRefreshToken;
//         await user.save({ validateBeforeSave: false });
//         return { accessToken, newRefreshToken };
//     } catch (error) {
//         console.error("Error generating access and refresh tokens:", error);
//         throw new Error("Internal server error");
//     }
// };

// generateAccessAndRefreshToken.js
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

/**
 * Generates a new access token and refresh token for a user.
 *
 * - Access token expiry can be configured with ACCESS_TOKEN_LIFETIME (e.g. "15m", "1h").
 * - Refresh token expiry can be configured with REFRESH_TOKEN_LIFETIME (e.g. "30d").
 *
 * Returns { accessToken, newRefreshToken } and saves the refresh token to the user document.
 */
export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found when generating tokens");

    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new Error("Missing token secrets in environment variables");
    }

    // Token lifetimes (strings accepted by jsonwebtoken, e.g. "15m", "1h", "30d")
    const accessLife = process.env.ACCESS_TOKEN_EXPIRY || "1h";   // default 1 hour (was 15m previously)
    const refreshLife = process.env.REFRESH_TOKEN_EXPIRY || "30d"; // default 30 days

    // Minimal payload — include user id and role (optional)
    const payload = { _id: user._id, role: user.role };

    // Sign tokens directly here so we control the expiry precisely
    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: accessLife });
    const newRefreshToken = jwt.sign({ _id: user._id }, refreshSecret, { expiresIn: refreshLife });

    // Save refresh token in DB (no validation of other fields)
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, newRefreshToken };
  } catch (error) {
    console.error("Error generating access and refresh tokens:", error);
    throw error;
  }
};
