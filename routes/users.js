const express = require('express')
const router = express.Router()


//create user validation
const vUser = require('../validators/users.js')
//create user controller
const cUser = require('../controllers/users.js')


//create user router
router.post('/create', vUser.vUserCraete, cUser.create)

//login user router
router.post('/login', vUser.vUserLogin, cUser.login)

//update user router
router.put('/update', vUser.vUserUpdate, cUser.update)

//delete user router
router.delete('/delete/:userId', vUser.vUserDelete, cUser.delete)

//get one user router
router.get('/one/:userId', vUser.vGetOne , cUser.getOne)

//get all user router
router.get('/all', cUser.getAll)


module.exports = router