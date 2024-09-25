const jwt = require('jsonwebtoken');

const verifyTokenAdmin = (req, res, next) => {
  let bearerToken = req.headers.authorization;

  if (bearerToken === undefined) {
    return res.status(401).send({ message: "Unauthorized Request" });
  } else {
    const token = bearerToken.split(" ")[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.decode = decode;
      next();
    } catch (err) {
      console.log(err.message);
      return res.status(401).send({ message: "Invalid or Expired Token" });
    }
  }
};

module.exports = verifyTokenAdmin;
