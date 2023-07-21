import { Exception } from "./exception"

export class NotFoundException extends Exception {
    error: string = 'Not Found'
    status: number = 404
    
    constructor(message: string | string[]) {
        super(message)
    }
}