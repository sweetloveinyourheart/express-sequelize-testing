import { Exception } from "./exception"

export class UnAuthorizedException extends Exception {
    error: string = 'Unauthorized'
    status: number = 401

    constructor(message: string | string[]) {
        super(message)
    }
}