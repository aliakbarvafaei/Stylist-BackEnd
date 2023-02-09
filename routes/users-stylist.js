const express = require('express')
const router = express.Router()


//create user-stylist validation
const vUser = require('../validators/users-stylist.js')
//create user-stylist controller
const cUser = require('../controllers/users-stylist.js')


// //create user-stylist router
// router.post('', vUser.vUserCraete, cUser.create)

// //get all user-stylist router
// router.get('', cUser.getAll)

// //update user-stylist router
// router.put('', vUser.vUserUpdate, cUser.update)

// //delete user-stylist router
// router.delete('/:userId', vUser.vUserDelete, cUser.delete)

//get one user-stylist router
router.get('/:userId', vUser.vGetOne , cUser.getOne)

//login user-stylist router
router.post('/login', vUser.vUserLogin, cUser.login)

//password reset user-stylist router
router.post('/password-reset', vUser.vPassReset, cUser.PassReset)

//password change user-stylist router
router.post('/password-change', vUser.vPassChange, cUser.PassChange)


module.exports = router