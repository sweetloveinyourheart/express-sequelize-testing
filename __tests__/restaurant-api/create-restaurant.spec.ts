import request from 'supertest'
import { app } from "../../src";
import { BadRequestException } from "../../src/common/exceptions/badRequestException";
import { Restaurant } from '../../src/models/restaurant.model';
import * as jwt from 'jsonwebtoken'

jest.mock("../../src/models/restaurant.model"); // Mock the Restaurant model
jest.mock('jsonwebtoken')

describe("new-restaurant", () => {
    const mockedJwtDecode = jwt.verify as jest.MockedFunction<typeof jwt.verify>
    const mockRestaurantCreate = Restaurant.create as jest.MockedFunction<typeof Restaurant.create>;
    const mockRestaurantSave = jest.fn();

    const newRestaurantDto = {
        name: "Delicious Bistro",
        cuisine_type: "Italian Food",
        address: "123 Main Street, Cityville",
        phone_number: "555-123-4567",
        opening_hours: "9:00 AM - 10:00 PM"
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 when request header not contain Bearer token', async () => {
        const response = await request(app).post("/api/v1/restaurant/new-restaurant").send(newRestaurantDto)
        expect(response.status).toBe(401)
    })

    it("should return 400 and validation error if validation fails", async () => {
        mockedJwtDecode.mockReturnValue({ sub: 1, username: 'user01' } as any)

        const response = await request(app).post("/api/v1/restaurant/new-restaurant")
            .send({})
            .set('Authorization', 'Bearer abc')

        expect(response.status).toBe(400)
        expect(response.body).toEqual(new BadRequestException(expect.any(Array)))
    });

    it("should return 201 and create new restaurant and return 201", async () => {
        mockedJwtDecode.mockReturnValue({ sub: 1, username: 'user01' } as any)
        mockRestaurantCreate.mockResolvedValue({
            save: mockRestaurantSave,
        } as any);

        const response = await request(app)
            .post("/api/v1/restaurant/new-restaurant")
            .send(newRestaurantDto)
            .set('Authorization', 'Bearer abc')

        expect(response.status).toBe(201)
    });

    it("should return 500 and message if any error occurs", async () => {
        mockedJwtDecode.mockReturnValue({ sub: 1, username: 'user01' } as any)
        Restaurant.create = jest.fn().mockRejectedValue(new Error("Create failed"));

        const response = await request(app)
            .post("/api/v1/restaurant/new-restaurant")
            .send(newRestaurantDto)
            .set('Authorization', 'Bearer abc')

        expect(response.status).toBe(500)
    });
});
