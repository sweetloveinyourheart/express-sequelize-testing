import { body } from "express-validator"

export class NewMenuItemsDto {
    name!: string
    description!: string
    price!: number
}

export function ValidateMenuItemDto() {
    return [
        body('name')
            .exists()
            .withMessage('Name cannot be empty !')
            .isLength({ min: 3, max: 60 })
            .withMessage('Name must have 3-20 characters'),
        body('description')
            .exists()
            .withMessage('Description cannot be empty !')
            .isLength({ min: 6, max: 200 })
            .withMessage('Description must have 6-30 characters'),
        body('price')
            .exists()
            .withMessage('Price cannot be empty !')
            .isFloat({ min: 0 })
            .withMessage('Min price cannot lower than 0')
    ]
}