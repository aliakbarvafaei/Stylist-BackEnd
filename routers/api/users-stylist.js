const express = require('express')
const router = express.Router()

//create user-stylist controller
const User = require('../../controllers/users-stylist.controller.js')


// //create user-stylist router
// router.post('', vUser.vUserCraete, cUser.create)

// //get all user-stylist router
// router.get('', cUser.getAll)

// //update user-stylist router
// router.put('', vUser.vUserUpdate, cUser.update)

// //delete user-stylist router
// router.delete('/:userId', vUser.vUserDelete, cUser.delete)

//get one user-stylist router
router.get('', User.GetOne)

//login user-stylist router
router.post('/login', User.Login)

//password reset user-stylist router
router.post('/password-reset', User.PassReset)

//password change user-stylist router
router.post('/password-change', User.PassChange)


module.exports = router