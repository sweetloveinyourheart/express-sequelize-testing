import request from 'supertest'
import { app } from '../../src';
import { BadRequestException } from '../../src/common/exceptions/badRequestException';
import { User } from '../../src/models/user.model';
import { UnAuthorizedException } from '../../src/common/exceptions/unAuthorizedException';
import * as bcrypt from "bcrypt";

jest.mock("../../src/models/user.model")
jest.mock("bcrypt")

describe('userLogin', () => {
    const mockedCompare = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 and validation error if validation fails", async () => {
        const response = await request(app).post("/api/v1/user/login").send({
            username: "user",
            password: "pass"
        })
        expect(response.status).toBe(400)
        expect(response.body).toEqual(new BadRequestException(expect.any(Array)))
    });

    it('should return 401 and "Username or password is wrong !" if username is not exist', async () => {
        User.findOne = jest.fn().mockReturnValue(null)
        const response = await request(app).post("/api/v1/user/login").send({
            username: "user",
            password: "password"
        })
        expect(response.status).toBe(401)
        expect(response.body).toEqual(new UnAuthorizedException("Username or password is wrong !"))
    })

    it('should return 401 and "Username or password is wrong !" if password is not match', async () => {
        User.findOne = jest.fn().mockReturnValue({ username: "user", password: "mockedpass" })
        const response = await request(app).post("/api/v1/user/login").send({
            username: "user",
            password: "password"
        })
        expect(response.status).toBe(401)
        expect(response.body).toEqual(new UnAuthorizedException("Username or password is wrong !"))
    })

    it('should return 200 and tokens when login successfully', async () => {
        User.findOne = jest.fn().mockReturnValue({ username: "user", password: "mockedpass" })
        mockedCompare.mockReturnValue(true as any)

        const response = await request(app).post("/api/v1/user/login").send({
            username: "user",
            password: "password"
        })
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })
    })
})