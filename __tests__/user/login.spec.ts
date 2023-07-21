import { Request } from "express";
import { login } from "../../src/controllers/user.controller";
import { validationResult } from "express-validator";
import { User } from "../../src/models/user.model";
import jwt from 'jsonwebtoken'

jest.mock("express-validator"); // Mock the express-validator module
jest.mock("jsonwebtoken"); // Mock the jsonwebtoken module
jest.mock("../../src/models/user.model"); // Mock the User model

// Mock the response object
const response: any = {
    status: jest.fn(() => response),
    json: jest.fn(),
};

describe('login', () => {
    const mockValidationResult = validationResult as jest.MockedFunction<
        typeof validationResult
    >;
    const mockJwtSign = jwt.sign as jest.MockedFunction<typeof jwt.sign>;
    const mockRequest = {
        body: { username: "testuser", password: "123456" },
    } as Request;

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should return 400 and validation error if validation fails", async () => {
        const mockErrors = {
            array: () => [
                {
                    type: 'field',
                    location: 'body',
                    path: 'password',
                    msg: 'Password must have 6-30 character'
                }
            ],
            isEmpty: () => false
        };
        mockValidationResult.mockReturnValue(mockErrors as any);

        await login(mockRequest, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            error: "Bad Request",
            message: mockErrors.array(),
            status: 400
        });
    });

    it("should return 401 and 'Username or password is wrong !' if user does not exist", async () => {
        const mockErrors = {
            array: () => [],
            isEmpty: () => true
        };
        mockValidationResult.mockReturnValue(mockErrors as any);

        User.findOne = jest.fn().mockResolvedValue(null);

        await login(mockRequest, response);

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({
            message: "Username or password is wrong !",
            status: 401,
            error: "Unauthorized"
        });
    });

    it("should return access and refresh tokens if user exists", async () => {
        const mockErrors = {
            array: () => [],
            isEmpty: () => true
        };
        mockValidationResult.mockReturnValue(mockErrors as any);

        const mockUser = {
            id: 1,
            username: "mockuser"
        }

        User.findOne = jest.fn().mockResolvedValue(mockUser);
        mockJwtSign.mockImplementation((payload: any, secret: string | null, options: any) => {
            return `mocked-token-${options.expiresIn}`;
        });

        await login(mockRequest, response)

        expect(mockJwtSign).toHaveBeenCalledWith(
            { sub: mockUser.id, username: mockUser.username },
            undefined,
            { expiresIn: "15m" }
        );
        expect(mockJwtSign).toHaveBeenCalledWith(
            { sub: mockUser.id, username: mockUser.username },
            undefined,
            { expiresIn: "7d" }
        );
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })
    })

    it("should return 500 and 'Internal Server Error' if an error occurs", async () => {
        User.findOne = jest.fn().mockRejectedValue(new Error("Some error"));
    
        await login(mockRequest, response);
    
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({
          message: expect.any(String),
          error: "Internal Server Error",
          status: 500
        });
      });
})