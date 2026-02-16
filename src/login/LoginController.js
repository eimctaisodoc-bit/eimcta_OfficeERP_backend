const express = require('express');
const { addUsers,getUsers,VerifyLoginUser } = require('../UserController/users/user');
const router = express.Router();
 
router.post('/createaccount',addUsers)
router.get('/createaccount',getUsers)

module.exports=router;