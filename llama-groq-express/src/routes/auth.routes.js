import express from 'express'
import { loginAdmin, loginUser, registerAdmin, registerUser } from '../controllers/auth.controller.js'

const router = express.Router()

// Admin auth
router.post('/admin/register', registerAdmin)
router.post('/admin/login', loginAdmin)

// User auth
router.post('/user/register', registerUser)
router.post('/user/login', loginUser)

export default router


