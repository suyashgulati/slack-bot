class DailyEntryError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class WfhEntryExistsError extends DailyEntryError {
    constructor(message) {
        super(message);
    }
}

export class DsrMissingError extends DailyEntryError {
    constructor(message) {
        super(message);
    }
}