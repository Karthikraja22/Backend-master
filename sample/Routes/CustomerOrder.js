const express = require('express')
const {createCustomer, getCustomer, getdetailbyId, deleteCustomer, updateCustomer, aggregateOrder} = require('../Controller/CustomerOrder')
const authenticate = require('../Middleware/authenticate')


const router = express.Router()
router.route('/create/new/customer').post(createCustomer)
router.route('/get/all/customer').get(getCustomer)
router.route('/get/customer/:id').get(authenticate,getdetailbyId)
router.route('/delete/customer/:id').delete(authenticate,deleteCustomer)
router.route('/update/customer/:id').put(authenticate,updateCustomer)
router.route('/aggregate/order').post(aggregateOrder)

module.exports= router 