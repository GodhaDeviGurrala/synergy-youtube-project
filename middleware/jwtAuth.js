const jwt = require("jsonwebtoken");

const middleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token found, authentication failed ..!" });
  }

    try {
    //   checking whether the logged in user and requesting user are same or not
    const verifyedUser = jwt.verify(token, "secretToken");
    req.user = verifyedUser;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = middleware;
