const userModel = require("../models/user.model");
const { cookieOptions } = require("../constant");
const {
    asyncHandler,
    apiResponse,
    sendResponse,
    generateAccessAndRefreshTokens,
} = require("../utils/helper.utils");

/**
 * @function registerUser
 * @async
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @throws {ApiError} Throws an ApiError if registration fails
 * @description This asynchronous function handles user registration. It checks if the provided email is already
 * registered, creates a new user if it is not, and sends a response indicating the registration status along with the
 * new user details.
 */
exports.registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if a user with the provided email already exists
    const isExistUser = await userModel.findOne({ email });
    if (isExistUser) {
        return sendResponse(res, 400, null, "User already exists");
    }

    // Create a new user with the provided email and password
    const newUser = await userModel.create({
        email,
        password,
    });

    // Verify that the new user was created successfully
    if (!newUser) {
        return sendResponse(
            res,
            400,
            null,
            "Something went wrong while creating the user",
        );
    }

    newUser.password = "*********";
    newUser.refreshToken = "********";

    // Send a success response with the new user details
    return sendResponse(res, 201, newUser, "User created successfully");
});

/**
 * @function login
 * @async
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @throws {ApiError} Throws an ApiError if validation or login fails
 * @description This asynchronous function handles user login. It validates the provided email and password,
 * generates access and refresh tokens upon successful login, sets cookies with the tokens, and sends a response
 * indicating the login status along with the user details (excluding password and refreshToken).
 */
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email and include the password in the returned user object
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return sendResponse(res, 404, null, "User not found");
    }

    // Check if the provided password matches the stored password
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
        return sendResponse(res, 400, null, "Invalid credentials");
    }

    // Generate access and refresh tokens for the user
    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);

        user.password = "*********"
    // Set cookies with the generated tokens and send a success response
    return res
        .status(200)
        .cookie("access-token", accessToken, cookieOptions)
        .cookie("refresh-token", refreshToken, cookieOptions)
        .json(
            new apiResponse(200, user, "User login successful, welcome back"),
        );
});

/**
 * @function getCurrentUser
 * @async
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @description This asynchronous function fetches the currently authenticated user's details using their ID.
 * If the user is found, it returns the user's details; otherwise, it returns a 404 error.
 */
exports.getCurrentUser = asyncHandler(async (req, res) => {
    // Fetch the user details from the partnerModel using the user ID from the request object
    const user = await userModel.findById(req.user._id);

    // Check if the user exists
    if (!user) {
        return sendResponse(res, 404, null, "User not found");
    }

    return sendResponse(res, 200, user, "User fetched successfully");
});

/**
 * @function logout
 * @async
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @description This asynchronous function handles user logout. It clears the user's refresh token from the database,
 * removes the access and refresh tokens from the cookies, and sends a response indicating the logout status.
 */
exports.logout = asyncHandler(async (req, res) => {
    // Clear the user's refresh token from the database
    await userModel.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1,
        },
    });

    // Clear the access and refresh tokens from the cookies and send a success response
    return res
        .status(200)
        .clearCookie("access-token", cookieOptions)
        .clearCookie("refresh-token", cookieOptions)
        .json(new apiResponse(200, null, "User logout successful"));
});
