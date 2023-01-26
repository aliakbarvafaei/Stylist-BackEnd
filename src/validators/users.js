//config database for send query
const { PrismaClient } = require('@prisma/client')
const { add } = require('lodash')
const db = new PrismaClient()
require('dotenv').config()

//lodash
const { parseInt } = require('lodash')
const _ = require('lodash')



exports.vUserCraete = (req, res, next) => {
    try {
        //const email_validation = require('email-validator')
        // if (!email_validation.validate(req.body.email)){
        //     //res.status(400).send('invalid email')
        //     res.send('invalid email')
        // }
        
        const username = req.body.username
        const firstname = req.body.firstName
        const lastname = req.body.lastName
        const email = req.body.email
        const phone = req.body.phone
        
        //check username
        if (!username){
            return res.json({
                status : -1,
                msg : "خطا: نام کاربری الزامی می‌باشد"
            })
        }

        //check email or phone number
        else if (!email && !phone){
            return res.json({
                status : -1,
                msg : "خطا: حداقل باید یکی از دو قسمت ایمیل یا شماره تلفن را وارد کنید"
            })
        }
        //validate email
        else if (email){
            if (email.indexOf("@") < 1){
                return res.json({
                    status : -1,
                    msg : "خطا: ایمیل شما صحیح نمی‌باشد"
                })
            }
            if (!_.endsWith(email, ".com")){
                return res.json({
                    status : -1,
                    msg : "خطا: ایمیل باید با .com تمام شود"
                })
            }
        }

        //validate phone
        else if (phone){
            if (!(phone.length === 11)){
                return res.json({
                    status : -1,
                    msg : "خطا: شماره تلفن باید ۱۱ رقم داشته باشد"
                })
            }
            if (isNaN(phone)){
                return res.json({
                    status : -1,
                    msg : "خطا: شماره تلفن باید عدد باشد"
                })
            }
        }

        //validate firstName
        else if (_.isNumber(firstname)){
            return res.json({
                status : -1,
                msg : "نام نباید شامل عدد باشد"
            })
        }

        //validate lastName
        else if (_.isNumber(lastname)){
            return res.json({
                status : -1,
                msg : "نام خانوادگی نباید شامل عدد باشد"
            })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.json({
            status : -1,
            msg : "خطا: عملیات با خطا مواجه شد"
        })
    }
}


exports.vUserLogin = (req, res, next) => {
    try {
        const username = req.body.username
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password

        //validate username
        if (!username){
            return res.json({
                status : -1,
                msg : "خطا: نام کاربری وارد نشده است"
            })
        }

        //validate password
        else if (!password){
            return res.json({
                status : -1,
                msg : "خطا: رمز وارد نشده است"
            })
        }

        //validate email & phone
        else if (!email && ! phone){
            return res.json({
                status : -1,
                msg : "خطا: حداقل باید یکی از دو قسمت ایمیل یا شماره تلفن را وارد کنید"
            })
        }
        
        next()
    } catch (error) {
        console.log(error)
        return res.json({
            status : -1,
            msg : "خطا: عملیات با خطا مواجه شد"
        })
    }
}


exports.vUserUpdate = async(req, res, next) => {
    try {
        const id = parseInt(req.body.id)
        const old_password = req.body.oldPassword
        const new_username = req.body.username
        const new_firstName = req.body.firstName
        const new_lastName = req.body.lastName
        const new_email = req.body.email
        const new_phone = req.body.phone

        //check exist user
        let user = await db.User.findFirst({
            where:{
                id: id
            }
        })
        if (!user){
            return res.json({
                status: -1,
                msg: "خطا: کاربری با این آی‌دی وجود ندارد"
            })
        }

        //authentication old password
        if (!old_password){
            return res.json({
                status: -1,
                msg: "خطا: وارد کردن رمز عبور قبلی الزامی است"
            })
        }

        user_auth = await db.User.findFirst({
            where:{
                id: id,
                password: old_password
            }
        })
        if (!user_auth){
            return res.json({
                status: -1,
                msg: "خطا: رمز عبور صحیح نمی‌باشد"
            })
        }

        //check duplicate username
        let duplicate_user = await db.User.findFirst({
            where:{
                NOT:{
                    id: id
                },
                username: new_username
            }
        })
        if (duplicate_user){
            return res.json({
                status: -1,
                msg: "خطا: نام کاربری تکراری می‌باشد"
            })
        }

        //check email or phone
        if (!new_email && !new_phone){
            return res.json({
                status : -1,
                msg : "خطا: حداقل باید یکی از دو قسمت ایمیل یا شماره تلفن را وارد کنید"
            })
        }

        //validate email
        else if (new_email){
            if (new_email.indexOf("@") < 1){
                return res.json({
                    status : -1,
                    msg : "خطا: ایمیل شما صحیح نمی‌باشد"
                })
            }
            if (!_.endsWith(new_email, ".com")){
                return res.json({
                    status : -1,
                    msg : "خطا: ایمیل باید با .com تمام شود"
                })
            }
        }

        //check duplicate email
        let duplicate_email = await db.User.findFirst({
            where:{
                NOT:{
                    id: id
                },
                email: new_email
            }
        })
        if (duplicate_email){
            return res.json({
                status: -1,
                msg: "خطا: ایمیل تکراری می‌باشد"
            })
        }

        //validate phone
        else if (new_phone){
            if (!(new_phone.length === 11)){
                return res.json({
                    status : -1,
                    msg : "خطا: شماره تلفن باید ۱۱ رقم داشته باشد"
                })
            }
            if (isNaN(new_phone)){
                return res.json({
                    status : -1,
                    msg : "خطا: شماره تلفن باید عدد باشد"
                })
            }
        }

        //check duplicate phone
        let duplicate_phone = await db.User.findFirst({
            where:{
                NOT:{
                    id: id
                },
                phone: new_phone
            }
        })
        if (duplicate_phone){
            return res.json({
                status: -1,
                msg: "خطا: شماره تلفن تکراری می‌باشد"
            })
        }

        //validate firstName
        else if (_.isNumber(new_firstName)){
            return res.json({
                status : -1,
                msg : "نام نباید شامل عدد باشد"
            })
        }

        //validate lastName
        else if (_.isNumber(new_lastName)){
            return res.json({
                status : -1,
                msg : "نام خانوادگی نباید شامل عدد باشد"
            })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.json({
            status : -1,
            msg : "خطا: عملیات با خطا مواجه شد"
        })
    }
}


exports.vUserDelete = async(req,res, next) => {
    try {
        //validate id parameter in url
        id = req.params.userId
        if (isNaN(id)){
            return res.json({
                status : -1,
                msg: "خطا: آی‌دی باید به صورت عددی باشد"
            })
        }

        //check isExist user
        let user = await db.User.findFirst({
            where:{
                id: parseInt(id)
            }
        })
        if (!user){
            return res.json({
                status: -1,
                msg: "خطا: کاربری با این آی‌دی وجود ندارد"
            })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.json({
            status : -1,
            msg : "خطا: عملیات با خطا مواجه شد"
        })
    }
}


exports.vGetOne = (req, res, next) => {
    try {
        //validate id parameter in url
        id = req.params.userId
        if (isNaN(id)){
            return res.json({
                status : -1,
                msg: "خطا: آی‌دی باید به صورت عددی باشد"
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.json({
            status : -1,
            msg : "خطا: عملیات با خطا مواجه شد"
        })
    }
}