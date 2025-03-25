
const jwt = require("jsonwebtoken");
const keys = require("../key"); // Ensure correct import
const mongoose = require("mongoose");
const User = require("../models/model");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in 1" });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, keys.Jwt_secret, async (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in 2" });
        }

        try {
            const { _id } = payload;
            const userData = await User.findById(_id);
            if (!userData) {
                return res.status(404).json({ error: "User not found" });
            }
            req.user = userData;
            next();
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    });
};
