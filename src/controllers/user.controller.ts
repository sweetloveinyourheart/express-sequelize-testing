import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserDto } from "../dtos/user.dto";
import { User } from "../models/user.model";
import { BadRequestException } from "../common/exceptions/badRequestException";
import { InternalServerErrorException } from "../common/exceptions/internalServerError";
import { UnAuthorizedException } from "../common/exceptions/unAuthorizedException";
import { NotFoundException } from "../common/exceptions/notFoundException";

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
        if (isExist) {
            const exception = new BadRequestException('Username has been taken before !')
            return response.status(exception.status).json(exception)
        }

        // hash password
        const salt = await bcrypt.genSalt()
        const hashedPass = await bcrypt.hash(body.password, salt)

        const newUser = await User.create({
            password: hashedPass,
            username: body.username
        })
        await newUser.save()

        return response.status(201).json({ message: 'New user created !' })

    } catch (error: any) {
        const exception = new InternalServerErrorException(error.message)
        return response.status(exception.status).json(exception)
    }
}

export async function login(request: Request, response: Response) {
    try {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            const exception = new BadRequestException(errors.array() as any)
            return response.status(exception.status).json(exception);
        }

        const body: UserDto = request.body

        // check username exist
        const user = await User.findOne({ where: { username: body.username } })
        if (!user) {
            const exception = new UnAuthorizedException('Username or password is wrong !')
            return response.status(exception.status).json(exception)
        }

        // check password is valid or not
        const isPasswordValid = await bcrypt.compare(body.password, user.password)                
        if (!isPasswordValid) {
            const exception = new UnAuthorizedException('Username or password is wrong !')
            return response.status(exception.status).json(exception)
        }

        const payload = {
            sub: user.id,
            username: user.username
        }

        const JWT_SECRET = process.env.JWT_SECRET as string

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

        return response.status(200).json({ accessToken, refreshToken })

    } catch (error: any) {
        const exception = new InternalServerErrorException(error.message)
        return response.status(exception.status).json(exception)
    }
}

export async function getUserProfile(request: Request, response: Response) {
    try {
        const userId = request?.user?.id
        if (!userId) {
            const exception = new UnAuthorizedException('Login required !')
            return response.status(exception.status).json(exception)
        }

        const userData = await User.findOne({
            where: { id: Number(userId) },
            attributes: ['username', 'email', 'address', 'phone_number']
        })

        if (!userData) {
            const exception = new NotFoundException('User not found')
            return response.status(exception.status).json(exception)
        }

        return response.status(200).json(userData)

    } catch (error: any) {
        const exception = new InternalServerErrorException(error.message)
        return response.status(exception.status).json(exception)
    }
}