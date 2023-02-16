const express = require('express')
const router = express.Router()


//create sellers validation
const vUser = require('../validators/sellers.js')
//create sellers controller
const cUser = require('../controllers/sellers.js')


// //create sellers router
// router.post('', vUser.vUserCraete, cUser.create)

// //get all sellers router
// router.get('', cUser.getAll)

// //update sellers router
// router.put('', vUser.vUserUpdate, cUser.update)

// //delete sellers router
// router.delete('/:userId', vUser.vUserDelete, cUser.delete)

//get one sellers router
router.get('', vUser.vGetOne , cUser.getOne)

//login sellers router
router.post('/login', vUser.vUserLogin, cUser.login)

//password reset sellers router
router.post('/password-reset', vUser.vPassReset, cUser.PassReset)

//password change sellers router
router.post('/password-change', vUser.vPassChange, cUser.PassChange)


module.exports = router