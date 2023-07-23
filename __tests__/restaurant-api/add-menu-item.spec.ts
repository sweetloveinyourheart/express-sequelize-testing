import request from 'supertest'
import { app } from "../../src";
import { NewMenuItemsDto } from '../../src/dtos/menu-item.dto';
import * as jwt from 'jsonwebtoken'
import { BadRequestException } from '../../src/common/exceptions/badRequestException';
import { Restaurant } from '../../src/models/restaurant.model';
import { MenuItem } from '../../src/models/menu-item.model';
import { NotFoundException } from '../../src/common/exceptions/notFoundException';

jest.mock('jsonwebtoken')
jest.mock('../../src/models/restaurant.model')

describe('add-menu-item', () => {
    const mockedJwtDecode = jwt.verify as jest.MockedFunction<typeof jwt.verify>

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const newMenuItem: NewMenuItemsDto = {
        name: 'menu item name',
        description: 'description',
        price: 23
    }

    it('should return 401 when request header not contain Bearer token', async () => {
        const response = await request(app)
            .post("/api/v1/restaurant/new-menu-item/1")
            .send(newMenuItem)
        expect(response.status).toBe(401)
    })

    it('should return 400 and validate errors message if got validation issue', async () => {
        mockedJwtDecode.mockReturnValue({ sub: 1, username: 'user01' } as any)

        const response = await request(app)
            .post("/api/v1/restaurant/new-menu-item/1")
            .set('Authorization', 'Bearer abc')
            .send({})

        expect(response.status).toBe(400)
        expect(response.body).toEqual(new BadRequestException(expect.any(Array)))
    })

    it('should return 404 when the restaurant not exist with given id', async () => {
        mockedJwtDecode.mockReturnValue({ sub: 1, username: 'user01' } as any)
        Restaurant.findOne = jest.fn().mockReturnValue(null)

        const response = await request(app)
            .post("/api/v1/restaurant/new-menu-item/1")
            .set('Authorization', 'Bearer abc')
            .send(newMenuItem)

        expect(response.status).toBe(404)
        expect(response.body).toEqual(new NotFoundException('Cannot find any restaurant which given id !'))
    })

    it('should return 201 when new menu item added to the restaurant menu', async () => {
        mockedJwtDecode.mockReturnValue({ sub: 1, username: 'user01' } as any)
        Restaurant.findOne = jest.fn().mockReturnValue({
            id: 1
        })

        // Mock the MenuItem.create() method to return a mocked newMenuItem object
        const mockedNewMenuItem = { save: () => jest.fn() };
        jest.spyOn(MenuItem, 'create').mockResolvedValue(mockedNewMenuItem);

        // Create a mock for the save() method
        const saveMock = jest.fn();
        jest.spyOn(mockedNewMenuItem, 'save' as never).mockImplementation(saveMock as never);

        const response = await request(app)
            .post("/api/v1/restaurant/new-menu-item/1")
            .set('Authorization', 'Bearer abc')
            .send(newMenuItem)

        expect(response.status).toBe(201)
    })
})