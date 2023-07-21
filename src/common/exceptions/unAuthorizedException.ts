import { Exception } from "./exception"

export class UnAuthorizedException extends Exception {
    error: string = 'UnAuthorized'
    status: number = 401

    constructor(message: string | string[]) {
        super(message)
    }
}