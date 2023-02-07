const express = require('express')
const router = express.Router()


//create user validation
const vUser = require('../validators/users.js')
//create user controller
const cUser = require('../controllers/users.js')


// //create user router
// router.post('', vUser.vUserCraete, cUser.create)

//update user router
router.put('', vUser.vUserUpdate, cUser.update)

// //delete user router
// router.delete('/:userId', vUser.vUserDelete, cUser.delete)

//get one user router
router.get('', vUser.vGetOne , cUser.getOne)

// //get all user router
// router.get('', cUser.getAll)

//login user router
router.post('/login', vUser.vUserLogin, cUser.login)

//login with code user router
router.post('/login-code', vUser.vUserLoginCode, cUser.loginCode)

//login with pass user router
router.post('/login-pass', vUser.vUserLoginPass, cUser.loginPass)

//password reset user router
router.post('/password-reset', vUser.vPassReset, cUser.PassReset)

//password change user router
router.post('/password-change', vUser.vPassChange, cUser.PassChange)


module.exports = router