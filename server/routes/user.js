const {Router}=require('express');
const {handleUserRegister, handleUserLogin}=require('../controllers/user')

const route=Router()

route.post('/api/auth/register',handleUserRegister)

route.post('/api/auth/login',handleUserLogin)

module.exports=route
