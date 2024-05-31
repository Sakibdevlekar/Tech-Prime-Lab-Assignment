const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};

module.exports = {
    DB_NAME: "Techprimelab",
    BASE_URL: "/api/v1",
    hashCount: 14,
    cookieOptions
};
