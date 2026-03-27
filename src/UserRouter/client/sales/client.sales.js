const express=require('express');
const { getSalesData } = require('../../../UserController/client/client.controller.sales');
const router=express.Router()

router.get('/',getSalesData)
router.post('/',)


module.exports=router
