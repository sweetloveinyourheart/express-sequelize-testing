import { body, validationResult } from 'express-validator';

export class UserDto {
    declare username: string
    declare password: string
}

export function ValidateUserDto() {
    return [
        body('username')
            .isLength({ min: 3, max: 20 })
            .withMessage('Username must have 3-20 characters')
            .exists()
            .withMessage('Username cannot be empty !'),
        body('password')
            .isLength({ min: 6, max: 30 })
            .withMessage('Password must have 6-30 characters')
            .exists()
            .withMessage('Password cannot be empty !')
    ]
}