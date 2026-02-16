const { verifyTokenJWT } = require('../middleware/tokengerate.js')

const verifyToken = (req, res, next) => {
  const token = req.cookies.token__;
  // console.log("Cookies:", req.cookies);

  if (!token) {
    return res.status(401).json({
      message: "No token found in cookies"
    });
  }
  try {
    const decoded = verifyTokenJWT(token);
    req.user = decoded;

    // console.log("User:", req.user);
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }

};
module.exports = verifyToken