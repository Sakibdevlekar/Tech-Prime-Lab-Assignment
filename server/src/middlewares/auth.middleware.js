const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { asyncHandler, apiError } = require("../utils/helper.utils");

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
    let user;
    const token = req.cookies["access-token"];
    if (!token) throw new apiError(403, "Access Denied:Invalid access token");
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
    if (decoded) {
        user = await userModel.findById(decoded.user._id);
    }

    if (!user) {
        throw new apiError(401, "Access Denied:Unauthorized request");
    }

    req.user = user;
    next();
});
