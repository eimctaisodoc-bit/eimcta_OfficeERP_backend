const express = require('express')
const router = express.Router();
router.use((req, res, next) => {
    console.log("adminRoutes reached",req.user);
    next();
    
});
router.use('/report',require('./admin.dashboard'))
router.use('/recruitment',require('./admin.recruitment'))

module.exports = router
