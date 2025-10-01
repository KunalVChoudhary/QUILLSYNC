const {Router}=require('express');
const {handleUserRegister, handleUserLogin, handleUserLogout}=require('../controllers/user');
const { userAuthorization } = require('../middleware/userAuthorization');

const route=Router()

route.post('/api/auth/register',handleUserRegister)

route.post('/api/auth/login',handleUserLogin)

route.get('/api/auth/logout',userAuthorization,handleUserLogout)

module.exports=route
