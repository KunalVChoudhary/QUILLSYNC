import {Router} from 'express';
import { userAuthorization } from '../middleware/userAuthorization.js';
import { handleUserRegister, handleUserLogin, handleUserLogout, checker } from '../controllers/user.js'
import { requestBodyInputValidate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../zodSchema/auth.js';


export const route=Router()

route.post(
    '/api/auth/register',
    requestBodyInputValidate(registerSchema),
    handleUserRegister
)

route.post(
    '/api/auth/login',
    requestBodyInputValidate(loginSchema),  
    handleUserLogin)

route.get(
    '/api/auth/logout',
    userAuthorization,
    handleUserLogout
)

route.get(
    '/api/auth/check',
    userAuthorization,
    checker
)