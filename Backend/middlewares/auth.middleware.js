import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../controllers/user.controller.js";

export const verifyJWT = async (req, res, next) => {
    try {
        // const token =
        //     req.cookies?.accessToken ||
        //     req.header("Authorization")?.replace("Bearer ", "") ||
        //     req.body?.accessToken;
        // if (!token) {
        //     return res.status(403).json({
        //         message: "JWT_ACCESS_TOKEN_NOT_FOUND",
        //         status: 403,
        //         success: false,
        //     });
        // }

        const token =
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.cookies?.accessToken ||
            req.body?.accessToken;

            if (!token) {
            return res.status(403).json({
                message: "JWT_ACCESS_TOKEN_NOT_FOUND",
                status: 403,
                success: false,
            });
            }

        // check is token is correct
        // keep it outside the try and catch block as it is required later on outside the try and catch block and keep it let instea of const
        let decoded = null;

        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Synchronous call
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                console.log("[server] access token expired for token:", token ? token.slice(0,10)+"..." : token);
                return res.status(403).json({
                error: err,
                message: "JWT_ACCESS_TOKEN_EXPIRY",
                status: 403,
                success: false,
                });
            } else if (err.name === "JsonWebTokenError") {
                return res.status(403).json({
                    error: err,
                    message: "JWT_ACCESS_TOKEN_INVALID",
                    status: 403,
                    success: false,
                });
            }
        }

        // Find the user associated with the token
        const user = await User.findById(decoded._id).select(
            "-password -refreshToken"
        );
        if (!user) {
            return res.status(403).json({
                message: "JWT_ACCESS_TOKEN_INVALID",
                status: 403,
                success: false,
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return res.status(403).json({
            message: "GENERAL_ERROR",
            status: 403,
            success: false,
            error: error.message,
        });
    }
};

// -----------------------------------------------------
// -----------------------------------------------------

// import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";

// export const verifyJWT = async (req, res, next) => {
//   try {
//     // Prefer Authorization header (Bearer token) first, then cookies, then body.
//     // This is important so retried requests that set Authorization: Bearer <newToken>
//     // are accepted even if the browser still has an old accessToken cookie.
//     const token =
//       req.header("Authorization")?.replace("Bearer ", "") ||
//       req.cookies?.accessToken ||
//       req.body?.accessToken;

//     if (!token) {
//       return res.status(403).json({
//         message: "JWT_ACCESS_TOKEN_NOT_FOUND",
//         status: 403,
//         success: false,
//       });
//     }

//     let decoded = null;

//     try {
//       decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     } catch (err) {
//       if (err.name === "TokenExpiredError") {
//         console.log("[server] verifyJWT: token expired");
//         return res.status(403).json({
//           error: err,
//           message: "JWT_ACCESS_TOKEN_EXPIRY",
//           status: 403,
//           success: false,
//         });
//       } else if (err.name === "JsonWebTokenError") {
//         console.log("[server] verifyJWT: token invalid");
//         return res.status(403).json({
//           error: err,
//           message: "JWT_ACCESS_TOKEN_INVALID",
//           status: 403,
//           success: false,
//         });
//       }
//     }

//     const user = await User.findById(decoded._id).select("-password -refreshToken");
//     if (!user) {
//       return res.status(403).json({
//         message: "JWT_ACCESS_TOKEN_INVALID",
//         status: 403,
//         success: false,
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Error verifying JWT:", error);
//     return res.status(403).json({
//       message: "GENERAL_ERROR",
//       status: 403,
//       success: false,
//       error: error.message,
//     });
//   }
// };

// --------------------------------------------------
// ----------------------------------------------

// auth.middleware.js
// import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";

// export const verifyJWT = async (req, res, next) => {
//   try {
//     // STRICT: only accept Authorization: Bearer <token>
//     // This makes the server rely on the token the client explicitly attaches,
//     // preventing the stale-cookie race.
//     const token = req.header("Authorization")?.replace("Bearer ", "") || null;

//     if (!token) {
//       return res.status(403).json({
//         message: "JWT_ACCESS_TOKEN_NOT_FOUND",
//         status: 403,
//         success: false,
//       });
//     }

//     let decoded = null;
//     try {
//       decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     } catch (err) {
//       if (err.name === "TokenExpiredError") {
//         console.log("[server] verifyJWT: token expired");
//         return res.status(403).json({
//           error: err,
//           message: "JWT_ACCESS_TOKEN_EXPIRY",
//           status: 403,
//           success: false,
//         });
//       } else if (err.name === "JsonWebTokenError") {
//         console.log("[server] verifyJWT: token invalid");
//         return res.status(403).json({
//           error: err,
//           message: "JWT_ACCESS_TOKEN_INVALID",
//           status: 403,
//           success: false,
//         });
//       }
//     }

//     const user = await User.findById(decoded._id).select("-password -refreshToken");
//     if (!user) {
//       return res.status(403).json({
//         message: "JWT_ACCESS_TOKEN_INVALID",
//         status: 403,
//         success: false,
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Error verifying JWT:", error);
//     return res.status(403).json({
//       message: "GENERAL_ERROR",
//       status: 403,
//       success: false,
//       error: error.message,
//     });
//   }
// };


