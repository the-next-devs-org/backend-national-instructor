// const express = require("express");
// const router = express.Router();
// const db = require("../Model")
// const jwt = require("jsonwebtoken");
// require("dotenv");
 
// const User = db.user;
// router.use(async (req, res, next) => {
//   try {
//     const token = req.headers.token;
//     if (!token) {
//       return res.status(400).json({
//         status: 400,
//         message: "JWT token not provided.",
//       });
//     }
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decodedToken) {
//       return res.status(403).json({ status: 403, message: "Invalid JWT token" });
//     }
 
//     // Check token expiration
//     if (decodedToken.exp <= Date.now() / 1000) {
//       return res.status(403).json({ status: 403, message: "JWT token has expired" });
//     }
//     // Find the user by ID and email
//     const user = await User.findOne({
//       where: {
//         id: decodedToken.user_id,
//         email: decodedToken.email
//       }
//     });
//     if (!user) {
//       return res.status(403).json({ status: 403, message: "User does not exist" });
//     }
//     req.decodedToken = decodedToken;
//     next();
//   } catch (error) {
//     console.error("Error in authentication middleware:", error);
//     return res.status(403).json({ status: 403, message: "Invalid JWT token. Or session expired" });
//   }
// });
// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../Model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = db.user;

router.use(async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(400).json({
        status: 400,
        message: "JWT token not provided.",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(403).json({
            status: 403,
            message: "JWT token has expired",
          });
        }
        return res.status(403).json({
          status: 403,
          message: "Invalid JWT token",
        });
      }

      // Verify user exists
      const user = await User.findOne({
        where: {
          id: decodedToken.user_id,
          email: decodedToken.email,
        },
      });

      if (!user) {
        return res.status(403).json({
          status: 403,
          message: "User does not exist",
        });
      }

      req.decodedToken = decodedToken;
      next();
    });
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error in authentication middleware",
    });
  }
});

module.exports = router;
