//config database for send query
require('dotenv').config()


exports.vImagesCraete = (req, res, next) => {
    try {
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send("عملیات با خطا مواجه شد")
    }
}