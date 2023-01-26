"use strict";
var express = require('express');
var fs = require('fs');
var cookie_parser = require('cookie-parser');
//config database
require('dotenv').config();
//create app
var app = express();
//middleeware
app.use(express.json({ limit: '50mb' }));
app.use(cookie_parser());
//route
fs.readdirSync("".concat(__dirname, "/routes")).map(function (route) {
    app.use('/irnode', require("./routes/".concat(route)));
});
//create server
var port = process.env.PORT || 8080;
var server = app.listen(port, function (req, res) {
    console.log("sever is running on port ".concat(port, " ..."));
});
