const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/model"); // Ensure this matches your model name
const bcryptjs = require('bcryptjs');
const jwt= require('jsonwebtoken');
const { Jwt_secret } = require('../key');
const requireLogin = require('../middlewares/requireLogin');
const { use } = require('./createPost');

router.get('/', (req, res) => {
    console.log("Hello");
    res.send("Hello");
});

router.post('/signup', async (req, res) => {
    try {
        const { name, userName, email, password } = req.body;

        if (!name || !userName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const savedUser = await User.findOne({ $or: [{ email: email }, { userName: userName }] });
        if (savedUser) {
            return res.status(422).json({ error: "User already exists with that email or username" });
        }
        const hashedPassword = await bcryptjs.hash(password, 12);

        const newUser = new User({
            name,
            userName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.json({ message: "Registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password" })
    }

    const savedUser = await User.findOne({ email: email })
    if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email or Password" })
    }

    const match = await bcryptjs.compare(password, savedUser.password)
    if (match) {
        // res.json({ message: "Successfully signed in" })
        const token= jwt.sign({_id:savedUser.id},Jwt_secret)
        const {_id,name,userName,email}=savedUser

        res.json({token,user:{_id,name,userName,email}})
        
        console.log({token,user:{_id,name,userName,email}});
    } else {
        return res.status(422).json({ error: "Invalid Email or Password" })
    }
})



module.exports = router;
