const express = require("express");
const fs = require("fs");
const cookie_parser = require("cookie-parser");
const cors = require("cors");
const path = require('path');

// var spawn = require("child_process").spawn;
// var process = spawn("python", [`${__dirname}/removeBg.py`, `${__dirname}/1.jpg`, `${__dirname}//output.png`]);
// process.stdout.on("data", function (data) {
//   console.log(data.toString());
// });
//config database
require("dotenv").config();

//create app
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.static(path.resolve('./public')));

//middleeware
app.use(express.json({ limit: "50mb" }));
app.use(cookie_parser());

//route
fs.readdirSync(`${__dirname}/routes`).map((route) => {
  app.use(`/${route.split('.')[0]}`, require(`./routes/${route}`));
});

//create server
const port = 8070;
let server = app.listen(port, (req, res) => {
  console.log(`sever is running on port ${port} ...`);
});
