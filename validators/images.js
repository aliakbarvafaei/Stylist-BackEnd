//config database for send query
const { add } = require('lodash')
require('dotenv').config()

//lodash
const { parseInt } = require('lodash')
const _ = require('lodash')



exports.vImagesCraete = (req, res, next) => {
    try {
        next()
    } catch (error) {
        console.log(error)
        return res.json({
            status : -1,
            msg : "خطا: عملیات با خطا مواجه شد"
        })
    }
}