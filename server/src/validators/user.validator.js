const { body } = require("express-validator");

exports.validateUserRegister = [
    body("email").notEmpty().withMessage("This field is required. Thank you!"),
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address. Thank you!"),
    body("password")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
    body("password")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
            pointsPerUnique: 1,
            pointsPerRepeat: 0.5,
            pointsForContainingLower: 10,
            pointsForContainingUpper: 10,
            pointsForContainingNumber: 10,
            pointsForContainingSymbol: 10,
        })
        .withMessage(
            `Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number and special character '! @ # $ % ^ & * ?'`,
        ),
];

exports.validateUserLogin = [
    body("email").notEmpty().withMessage("This field is required. Thank you!"),
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address. Thank you!"),
];
