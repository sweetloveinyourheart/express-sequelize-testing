import * as jwt from 'jsonwebtoken'
import request from 'supertest'
import { app } from '../../src'
import { User } from '../../src/models/user.model'

jest.mock('jsonwebtoken')
jest.mock("../../src/models/user.model")

describe("getProfile", () => {
    const mockedJwtDecode = jwt.verify as jest.MockedFunction<typeof jwt.verify>

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 when request header not contain Bearer token', async () => {
        const response = await request(app).get('/api/v1/user/get-profile')
        expect(response.status).toBe(401)
    })

    it('should return 404 if no user match the user id', async () => {
        mockedJwtDecode.mockReturnValue({ sub: 1, username: 'user01' } as any)
        User.findOne = jest.fn().mockReturnValue(null)
        const response = await request(app)
            .get('/api/v1/user/get-profile')
            .set('Authorization', 'Bearer abc')
        expect(response.status).toBe(404)
    })

    it('should return 200 and user profile', async () => {
        mockedJwtDecode.mockReturnValue({ sub: 1, username: 'user01' } as any)

        const userProfile: Partial<User> = {
            username: "user01",
            email: null,
            address: null,
            phone_number: null
        }

        User.findOne = jest.fn().mockReturnValue(userProfile)
        const response = await request(app)
            .get('/api/v1/user/get-profile')
            .set('Authorization', 'Bearer abc')
            
        expect(response.status).toBe(200)
        expect(response.body).toEqual(userProfile)
    })
})