const jwt = require("jsonwebtoken");

const authMiddleware = {};

authMiddleware.loginRequired = async (req, res, next) => {
  try {
    // 1. Get the token from request
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new Error("Token not found");
    }
    const token = tokenString.replace("Bearer ", "");

    // 2. Check the token is exist
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          throw new Error("Token expired");
        } else {
          throw new Error("Token is invalid");
        }
      }

      req.userId = payload._id;
    });

    // 3. Go to the next step (Add book)
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
