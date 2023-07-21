import { Request } from "express";
import { User } from "../../src/models/user.model";
import { getUserProfile } from "../../src/controllers/user.controller";

jest.mock("../../src/models/user.model"); // Mock the User model

// Mock the response object
const response: any = {
    status: jest.fn(() => response),
    json: jest.fn(),
};

describe('getUserProfile', () => {
    const mockRequest = { user: { id: 1 } } as Request;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 401 and 'Login required !' if user is not logged in", async () => {
        const mockRequestWithoutUserId = { user: undefined } as Request;

        await getUserProfile(mockRequestWithoutUserId, response);

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({
            message: "Login required !",
            error: "Unauthorized",
            status: 401
        });
    });

    it("should return 404 and 'User not found' if the user does not exist", async () => {
        User.findOne = jest.fn().mockResolvedValue(null);

        await getUserProfile(mockRequest, response);

        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.json).toHaveBeenCalledWith({
            message: "User not found",
            error: "Not Found",
            status: 404
        });
    });

    it("show return the user profile when user data exists", async () => {
        const mockUserData = {
            id: 123,
            username: "testuser",
            email: "test@example.com",
            address: "Test Address",
            phone_number: "1234567890",
        };
        User.findOne = jest.fn().mockResolvedValue(mockUserData);

        await getUserProfile(mockRequest, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith(mockUserData)
    })

    it("should return 500 and 'Internal Server Error' if an error occurs", async () => {
        User.findOne = jest.fn().mockRejectedValue(new Error("An error occurred"));

        await getUserProfile(mockRequest, response);

        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({
            message: "An error occurred",
            status: 500,
            error: "Internal Server Error"
        });
    });
})