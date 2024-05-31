const router = require("express").Router();
const {
    registerUser,
    getCurrentUser,
    login,
    logout,
} = require("../controllers/user.controller");
const {
    validateUserRegister,
    validateUserLogin,
} = require("../validators/user.validator");
const { dataValidationResult } = require("../validators/validationResult");
const { isAuthenticated } = require("../middlewares/auth.middleware");

router.post(
    "/register",
    [validateUserRegister, dataValidationResult],
    registerUser,
);

router.post("/login", [validateUserLogin, dataValidationResult], login);


/* Protected Route*/
router.use(isAuthenticated);

router.get("/get-current-user",getCurrentUser)

router.post("/logout", logout);

module.exports = { userRouters: router };
