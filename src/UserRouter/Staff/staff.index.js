const express=require('express')
const router=express.Router()

router.use((req, res, next) => {
    console.log("Staff reached",req.user);
    // res.redirect('/admin/dashboard')
    next();

});
router.use('/sales',require('./staff.sales.js'));
// router.use('report',require('./sales/sales.index'));
module.exports=router