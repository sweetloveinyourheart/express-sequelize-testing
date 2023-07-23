import { Router } from "express";
import { getUserProfile, login, newUser } from "../controllers/user.controller";
import { ValidateUserDto } from "../dtos/user.dto";
import { AuthGuard } from "../middlewares/jwtAuthGuard";
import { addMenuItem, getRestaurants, newRestaurant } from "../controllers/restaurant.controller";
import { ValidateRestaurantDto } from "../dtos/restaurant.dto";
import { ValidateMenuItemDto } from "../dtos/menu-item.dto";

const router = Router()

router.get('/user/get-profile', AuthGuard, getUserProfile)
router.post('/user/new-user', ValidateUserDto(), newUser)
router.post('/user/login', ValidateUserDto(), login)

router.get('/restaurant/get-all', getRestaurants)
router.post('/restaurant/new-restaurant', AuthGuard, ValidateRestaurantDto(), newRestaurant)
router.post('/restaurant/new-menu-item/:restaurantId', AuthGuard, ValidateMenuItemDto(), addMenuItem)

export default router