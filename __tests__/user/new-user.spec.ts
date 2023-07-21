import { Request, Response } from "express";
import { genSalt, hash } from "bcrypt";
import { ValidationError, validationResult } from "express-validator";
import { newUser } from '../../src/controllers/user.controller'; // Import the function to be tested
import { User } from "../../src/models/user.model";
import { BadRequestException } from "../../src/common/exceptions/badRequestException";

jest.mock("express-validator"); // Mock the express-validator module
jest.mock("bcrypt"); // Mock the bcrypt module
jest.mock("../../src/models/user.model"); // Mock the User model

// Mock the response object
const response: any = {
    status: jest.fn(() => response),
    json: jest.fn(),
};

describe("newUser", () => {
    const mockValidationResult = validationResult as jest.MockedFunction<
        typeof validationResult
    >;
    const mockGenSalt = genSalt as jest.MockedFunction<typeof genSalt>;
    const mockHash = hash as jest.MockedFunction<typeof hash>;
    const mockUserCreate = User.create as jest.MockedFunction<typeof User.create>;
    const mockUserSave = jest.fn();

    const mockRequest = {
        body: { username: "testuser", password: "123456" },
    } as Request;

    beforeEach(() => {
        jest.clearAllMocks();
    });

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

        await newUser(mockRequest, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            error: "Bad Request",
            message: mockErrors.array(),
            status: 400
        });
    });

    it("should return 400 and 'Username has been taken before !' if username already exists", async () => {
        const mockErrors = {
            array: () => [],
            isEmpty: () => true
        };
        mockValidationResult.mockReturnValue(mockErrors as any);

        User.findOne = jest.fn().mockResolvedValue({
            username: 'testuser',
            password: "123456"
        });

        await newUser(mockRequest, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            error: "Bad Request",
            message: "Username has been taken before !",
            status: 400
        });
    });

    it.skip("should create a new user and return 201", async () => {
        User.findOne = jest.fn().mockResolvedValue(null);
        mockGenSalt.mockResolvedValue("test-salt" as never);
        mockHash.mockResolvedValue("hashed-password" as never);
        mockUserCreate.mockResolvedValue({
            save: mockUserSave,
        } as any);

        await newUser(mockRequest, response);

        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith({ message: "New user created !" });
        expect(mockUserCreate).toHaveBeenCalledWith({
            password: "hashed-password",
            username: "testuser",
        });
        expect(mockUserSave).toHaveBeenCalled();
    });

    it.skip("should return 400 and 'Create user failed !' if any error occurs", async () => {
        User.findOne = jest.fn().mockRejectedValue(new Error("Some error"));

        await newUser(mockRequest, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: "Create user failed !",
        });
    });
});
