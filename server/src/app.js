require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const { BASE_URL } = require("./constant");
const morganMiddleware = require("./loggers/morgan.logger");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const cookieParser = require("cookie-parser");
const { apiRateLimiter } = require("./utils/apiRateLimiter");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:5173","http://192.168.1.5:5173"],
        credentials: true,
    }),
);

app.use(morganMiddleware);

/* Uncomment and configure Helmet middleware if needed */
// app.use(
//     helmet({
//         frameguard: {
//             action: "deny",
//         },
//         hsts: {
//             maxAge: 31536000,
//             includeSubDomains: true,
//             preload: true,
//         },
//         referrerPolicy: {
//             policy: "same-origin",
//         },
//     }),
// );

/* Uncomment and configure API rate limiter if needed */
// app.use(apiRateLimiter);

/* Importing Routers */
const { userRouters } = require("./routes/user.routes");
const { projectRouters } = require("./routes/project.routes");

app.use(`${BASE_URL}/user`, userRouters);
app.use(`${BASE_URL}/project`, projectRouters);

app.use(errorHandler);

module.exports = { app };
