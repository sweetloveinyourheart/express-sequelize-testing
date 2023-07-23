import { body } from "express-validator"
import { CuisineType } from "../models/restaurant.model"

export class RestaurantDto {
    name!: string
    cuisine_type!: CuisineType
    address!: string
    phone_number!: string
    opening_hours!: string
}

export function ValidateRestaurantDto() {
    return [
        body('name')
            .exists()
            .withMessage('Name cannot be empty !')
            .isLength({ min: 3, max: 20 })
            .withMessage('Name must have 3-20 characters'),
        body('cuisine_type')
            .exists()
            .withMessage('Cuisine type cannot be empty !')
            .isIn(Object.values(CuisineType))
            .withMessage('Must be a valid cuisine'),
        body('phone_number')
            .exists()
            .withMessage('Phone number cannot be empty !')
            .isLength({ min: 10, max: 20 })
            .withMessage('Phone number must have at least 10 characters'),
        body('address')
            .exists()
            .withMessage('Address cannot be empty !')
            .isLength({ min: 6, max: 30 })
            .withMessage('Address must have 6-30 characters'),
        body('opening_hours')
            .exists()
            .withMessage('Address cannot be empty !')
    ]
}