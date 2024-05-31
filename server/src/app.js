require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { BASE_URL } = require("./constant");
const morganMiddleware = require("./loggers/morgan.logger");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const cookieParser = require("cookie-parser");
const { apiRateLimiter } = require("./utils/apiRateLimiter");

app.use(cors());
app.use(cookieParser());

/**
 * Sets the response headers to allow cross-origin requests (CORS)
 * @param {import('express').Request} req - The request object
 * @param {import('express').Response} res - The response object
 * @param {Function} next - The next middleware function in the stack
 */
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

/**
 * Sets the response headers to allow cross-origin requests (CORS)
 * @param {import('express').Request} req - The request object
 * @param {import('express').Response} res - The response object
 * @param {Function} next - The next middleware function in the stack
 */
app.use(
    helmet({
        frameguard: {
            action: "deny",
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        referrerPolicy: {
            policy: "same-origin",
        },
    }),
);

/*Api rate limiter */
// app.use(apiRateLimiter);

/* Importing Routers */

const { userRouters } = require("./routes/user.routes");
const { projectRouters } = require("./routes/project.routes");
/*Api Logger */
app.use(morganMiddleware);

app.use(`${BASE_URL}/user`, userRouters);
app.use(`${BASE_URL}/project`, projectRouters);


app.use(errorHandler);
module.exports = { app };
