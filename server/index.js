const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const cors = require("cors");
const AuthRouter = require("./Router/AuthRouter");
const ApiRouter = require("./Router/ApiRouter");

require("dotenv").config();
require("./Models/db");
require("./Utils/redisClient");


const PORT = process.env.PORT || 8000;

app.get("/ping", (req, res) => {
    res.send("PONG");
});

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", AuthRouter);
app.use("/api", ApiRouter);

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});