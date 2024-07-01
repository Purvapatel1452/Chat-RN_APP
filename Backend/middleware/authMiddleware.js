const authMiddleware = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.header("Authorization");
  console.log(authHeader, "HEAD");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    console.log(token);
    if (token) {
      next();
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
