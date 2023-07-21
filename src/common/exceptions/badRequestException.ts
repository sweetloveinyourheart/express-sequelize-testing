import { Exception } from "./exception"

export class BadRequestException extends Exception {
    error: string = 'Bad Request'
    status: number = 400
    
    constructor(message: string | string[]) {
        super(message)
    }
}