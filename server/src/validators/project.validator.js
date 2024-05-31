const { body } = require("express-validator");

exports.validateAddProject = [
    body("projectName")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
    body("reason").notEmpty().withMessage("This field is required. Thank you!"),
    body("type").notEmpty().withMessage("This field is required. Thank you!"),
    body("division")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
    body("category")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
    body("priority")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
    body("department")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
    body("startDate")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
    body("endDate")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
    body("location")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
];

exports.validateUpdateProject = [
    body("projectId")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
    body("status").notEmpty().withMessage("This field is required. Thank you!"),
];
