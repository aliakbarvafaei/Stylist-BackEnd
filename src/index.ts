const express = require('express')
const fs = require('fs')
const cookie_parser = require('cookie-parser')


//config database
require('dotenv').config()


//create app
const app = express()


//middleeware
app.use(express.json({limit : '50mb'}))
app.use(cookie_parser())


//route
fs.readdirSync(`${__dirname}/routes`).map((route:any) => {
    app.use('/irnode', require(`./routes/${route}`))
})


//create server
const port = process.env.PORT || 8080
let server = app.listen(port, (req:any, res:any) => {
    console.log(`sever is running on port ${port} ...`)
})