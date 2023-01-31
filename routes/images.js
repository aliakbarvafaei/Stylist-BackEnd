const express = require('express')
const multer = require('multer');
const path = require('path');
const router = express.Router()
const fs = require('fs');

var spawn = require("child_process").spawnSync;

// config image save with multer
const imageStorage = multer.diskStorage({
    destination: 'public/images', // Destination to store image 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
        // file.fieldname is name of the field (image), path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000   // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {     // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})
//create images validation
const vImages = require('../validators/images.js')

//create images router
router.post('/uploadBulkImage',
(req, res, next) => vImages.vImagesCraete(req,res,next)
, imageUpload.array('images', 5), (req, res) => {
    req.files.forEach((item)=>{
        var process = spawn("python", [`public/removeBg.py`, `public/images/${item.filename}`, `public/images/bg_${(item.filename).split('.')[0]}.png`]);
        // process.stdout.on("data", function (data) {
        //     console.log(data.toString());
        // });
    })
    res.sendFile(path.resolve(`public/images/bg_${(req.files[0].filename).split('.')[0]}.png`),function(err){
        if(err){
            console.log(err)
        }else{
            req.files.forEach((item)=>{
                fs.unlink(`public/images/bg_${item.filename.split('.')[0]}.png`, (err) => {
                    if (err) {
                        throw err;
                    }
            
                    console.log("Delete File bg successfully.");
                });
            })
        }
    })
    req.files.forEach((item)=>{
        fs.unlink(`public/images/${item.filename}`, (err) => {
            if (err) {
                throw err;
            }

            console.log("Delete File original successfully.");
        });
    })
    // console.log(`public/images/bg_${(req.files[0].filename).split('.')[0]}.png`)
    // res.status(200).send({ data: "images recived" })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})



module.exports = router