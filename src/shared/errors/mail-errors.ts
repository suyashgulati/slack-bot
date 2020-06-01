export class MailError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class MailOptionsInvalidError extends MailError {
    constructor(message) {
        super(message);
    }
}
