export class Exception {
    error!: string
    status!: number
    message: string | string[]

    constructor(message: string | string[]) {
        this.message = message
    }
}