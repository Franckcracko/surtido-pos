import { Router } from "express";

import { validateAuthMiddleware } from "../middlewares/validate-auth.js";
import { getProfile, login, logout, register, updatePassword, deleteUser } from "../controllers/user.js";

const authRouter = Router()

authRouter.post('/login', login)

authRouter.post('/register', register)

authRouter.post('/logout', logout)

authRouter.delete('/delete', validateAuthMiddleware, deleteUser)

authRouter.get('/profile', validateAuthMiddleware, getProfile)

authRouter.put('/profile/password', validateAuthMiddleware, updatePassword)

export default authRouter