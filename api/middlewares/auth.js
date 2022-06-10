import jwt from "jsonwebtoken";

const config = process.env;

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    req.token = bearer[1];
    try {
      req.user = jwt.verify(req.token, config.TOKEN_KEY);
    } catch (err) {
      return res.status(401).json({message: "Invalid Token"});
    }
    return next();
  } else {
    return res.status(403).json({message: 'Unauthorized'});
  }
}

export default { verifyToken };