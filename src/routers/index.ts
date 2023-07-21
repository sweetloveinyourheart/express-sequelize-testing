import { Router } from "express";
import { newUser } from "../controllers/user.controller";
import { ValidateUserDto } from "../dtos/user.dto";

const router = Router()

router.post('/user/new-user', ValidateUserDto(), newUser)

export default router