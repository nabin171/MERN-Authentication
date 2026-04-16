import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({
      success: false,
      message: "Not authorized. Login again.",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode.id) {
      return res.json({
        success: false,
        message: "Not authorized. Login again.",
      });
    }

    // safest way
    req.user = { id: tokenDecode.id };

    // Optional: if you want to keep req.body.userId
    req.body = req.body || {};
    req.body.userId = tokenDecode.id;

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
