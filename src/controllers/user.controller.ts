import { genSalt, hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserDto } from "../dtos/user.dto";
import { User } from "../models/user.model";
import { BadRequestException } from "../common/exceptions/badRequestException";

export async function newUser(request: Request, response: Response) {
    try {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            const exception = new BadRequestException(errors.array() as any)
            return response.status(exception.status).json(exception);
        }

        const body: UserDto = request.body

        // check username exist
        const isExist = await User.findOne({ where: { username: body.username } })
        if(isExist) {
            const exception = new BadRequestException('Username has been taken before !')
            return response.status(exception.status).json(exception)
        }

        // hash password
        const salt = await genSalt(10)
        const hashedPass = await hash(body.username, salt)

        const newUser = await User.create({
            password: hashedPass,
            username: body.username
        })
        await newUser.save()

        return response.status(201).json({ message: 'New user created !' })

    } catch (error: any) {
        const exception = new BadRequestException(error.message)
        return response.status(exception.status).json(exception)
    }
}