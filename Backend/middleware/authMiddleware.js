const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.header("Authorization");
  console.log(authHeader,"HEAD")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "");
console.log(token)
  try {
    // Verify token
    // const decoded = jwt.verify(token, "Purv@ p@tel");
    // req.user = decoded; // Add user data to request object
    next(); 
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;










// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   // Get token from the Authorization header
//   const token = req.header("Authorization").replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ message: "Access Denied. No token provided." });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, "Purv@ p@tel");
//     req.user = decoded; // Add user data to request object
//     next(); // Pass control to the next middleware or route handler
//   } catch (err) {
//     res.status(400).json({ message: "Invalid token." });
//   }
// };

// module.exports = authMiddleware;
