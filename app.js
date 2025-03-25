
const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const {mongoUrl} = require('./key');
const cors = require('cors');


app.use(cors());
require("./models/model");
require("./models/post")
app.use(express.json());
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))
mongoose.connect(mongoUrl);

mongoose.connection.on("connected",()=>{
    console.log("Successfully Connected to MongoDB")
})

mongoose.connection.on("error",()=>{
    console.log("Not Connected to MongoDB")
})


app.listen(PORT,()=>{
    console.log("Server is Running on Port",PORT);
})