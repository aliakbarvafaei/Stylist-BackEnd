const express = require('express')
const router = express.Router()


//create user validation
const vUser = require('../validators/users.js')
//create user controller
const cUser = require('../controllers/users.js')


//create user router
router.post('/user/create', vUser.vUserCraete, cUser.create)

//login user router
router.post('/user/login', vUser.vUserLogin, cUser.login)

//update user router
router.put('/user/update', vUser.vUserUpdate, cUser.update)

//delete user router
router.delete('/user/delete/:userId', vUser.vUserDelete, cUser.delete)

//get one user router
router.get('/user/one/:userId', vUser.vGetOne , cUser.getOne)

//get all user router
router.get('/users/all', cUser.getAll)


module.exports = router