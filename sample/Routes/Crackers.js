const express = require ('express')

const { createCracker, getCracker, getdetailbyId, deletebyId, updatecrackerdetails } = require ('../Controller/cracker')
const authenticate = require('../Middleware/authenticate')

const router = express.Router()

router.route('/create/new/cracker').post(createCracker)

router.route('/get/all/crackers').get(getCracker)

router.route('/get/cracker/:id').get(authenticate,getdetailbyId)

router.route('/delete/cracker/:id').delete(authenticate,deletebyId)

router.route('/update/cracker/:id').put(authenticate,updatecrackerdetails)

module.exports = router