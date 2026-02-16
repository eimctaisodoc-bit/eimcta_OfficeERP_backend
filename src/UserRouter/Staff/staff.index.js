const express=require('express')
const router=express.Router()

router.use((req, res, next) => {
    console.log("Staff reached",req.user);
    // res.redirect('/admin/dashboard')
    next();

});
module.exports=router