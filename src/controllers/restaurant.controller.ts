import { Request, Response } from "express";
import { InternalServerErrorException } from "../common/exceptions/internalServerError";
import { validationResult } from "express-validator";
import { BadRequestException } from "../common/exceptions/badRequestException";
import { RestaurantDto } from "../dtos/restaurant.dto";
import { Restaurant } from "../models/restaurant.model";
import { NewMenuItemsDto } from "../dtos/menu-item.dto";
import { MenuItem } from "../models/menu-item.model";
import { NotFoundException } from "../common/exceptions/notFoundException";

export async function newRestaurant(request: Request, response: Response) {
    try {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            const exception = new BadRequestException(errors.array() as any)
            return response.status(exception.status).json(exception);
        }

        const body: RestaurantDto = request.body
        const newRestaurant = await Restaurant.create(body)

        await newRestaurant.save()
        return response.status(201).json({ message: 'New restaurant registered !' })

    } catch (error: any) {
        const exception = new InternalServerErrorException(error.message)
        return response.status(exception.status).json(exception)
    }
}

export async function getRestaurants(request: Request, response: Response) {
    try {
        const restaurants = await Restaurant.findAll({
            include: [{ model: MenuItem, as: 'menu_items' }]
        })
        return response.status(200).json(restaurants)
    } catch (error: any) {
        const exception = new InternalServerErrorException(error.message)
        return response.status(exception.status).json(exception)
    }
}

export async function addMenuItem(request: Request, response: Response) {
    try {
        // request validation
        const { restaurantId } = request.params

        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            const exception = new BadRequestException(errors.array() as any)
            return response.status(exception.status).json(exception);
        }

        // check if restaurant exist or not
        const restaurant = await Restaurant.findOne({
            where: { id: restaurantId }
        })
        if (!restaurant) {
            const exception = new NotFoundException('Cannot find any restaurant which given id !')
            return response.status(exception.status).json(exception);
        }

        // create new item
        const body: NewMenuItemsDto = request.body
        const newMenuItem = await MenuItem.create({
            restaurant_id: Number(restaurantId),
            name: body.name,
            price: body.price,
            description: body.description
        })

        await newMenuItem.save()
        return response.status(201).json({ message: 'New menu item added !' })

    } catch (error: any) {
        const exception = new InternalServerErrorException(error.message)
        return response.status(exception.status).json(exception)
    }
}