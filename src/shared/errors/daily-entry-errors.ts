class DailyEntryError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class WfhExistsError extends DailyEntryError {
    constructor(message) {
        super(message);
    }
}

export class WfhMissingError extends DailyEntryError {
    constructor(message) {
        super(message);
    }
}

export class DsrExistsError extends DailyEntryError {
    constructor(message) {
        super(message);
    }
}

export class DsrMissingError extends DailyEntryError {
    constructor(message) {
        super(message);
    }
}