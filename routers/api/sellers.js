const express = require('express')
const router = express.Router()


//create sellers controller
const Seller = require('../../controllers/sellers.controller.js')


// //create sellers router
// router.post('', vUser.vUserCraete, cUser.create)

// //get all sellers router
// router.get('', cUser.getAll)

// //update sellers router
// router.put('', vUser.vUserUpdate, cUser.update)

// //delete sellers router
// router.delete('/:userId', vUser.vUserDelete, cUser.delete)

//get one sellers router
router.get('', Seller.GetOne)

//login sellers router
router.post('/login', Seller.Login)

//password reset sellers router
router.post('/password-reset', Seller.PassReset)

//password change sellers router
router.post('/password-change', Seller.PassChange)


module.exports = router