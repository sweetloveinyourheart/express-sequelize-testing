import { Exception } from "./exception"

export class InternalServerErrorException extends Exception {
    error: string = 'Internal Server Error'
    status: number = 500
    
    constructor(message: string | string[]) {
        super(message)
    }
}