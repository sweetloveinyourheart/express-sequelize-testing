import { Router } from "express";
import { getUserProfile, login, newUser } from "../controllers/user.controller";
import { ValidateUserDto } from "../dtos/user.dto";
import { AuthGuard } from "../middlewares/jwtAuthGuard";

const router = Router()

router.get('/user/get-profile', AuthGuard, getUserProfile)
router.post('/user/new-user', ValidateUserDto(), newUser)
router.post('/user/login', ValidateUserDto(), login)

export default router