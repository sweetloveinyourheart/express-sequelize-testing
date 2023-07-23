import { User } from "../../src/models/user.model";
import request from 'supertest'
import { app } from "../../src";
import { BadRequestException } from "../../src/common/exceptions/badRequestException";

jest.mock("../../src/models/user.model"); // Mock the User model

describe("newUser", () => {
    const mockUserCreate = User.create as jest.MockedFunction<typeof User.create>;
    const mockUserSave = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 and validation error if validation fails", async () => {
        const response = await request(app).post("/api/v1/user/new-user").send({
            username: "user",
            password: "pass"
        })
        expect(response.status).toBe(400)
        expect(response.body).toEqual(new BadRequestException(expect.any(Array)))
    });

    it("should return 400 and 'Username has been taken before !' if username already exists", async () => {
        User.findOne = jest.fn().mockReturnValue(new User({ username: 'user', password: 'pass' }))
        const response = await request(app).post("/api/v1/user/new-user").send({
            username: "user",
            password: "password"
        })
        expect(response.status).toBe(400)
        expect(response.body).toEqual(new BadRequestException('Username has been taken before !'))
    });

    it("should create a new user and return 201", async () => {
        User.findOne = jest.fn().mockReturnValue(null)
        mockUserCreate.mockResolvedValue({
            save: mockUserSave,
        } as any);

        const response = await request(app).post("/api/v1/user/new-user").send({
            username: "user",
            password: "password"
        })
        expect(response.status).toBe(201)
    });

    it("should return 500 and message if any error occurs", async () => {
        User.findOne = jest.fn().mockRejectedValue(new Error("Query failed"));
        const response = await request(app).post("/api/v1/user/new-user").send({
            username: "user",
            password: "password"
        })
        expect(response.status).toBe(500)
    });
});
