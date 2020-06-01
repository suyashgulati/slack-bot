import { IType } from "../enums/type";

export default interface IMailOptions {
    userId: string;
    to: string;
    cc: string[];
    subject: string;
    html: string;
    messageId?: string;
    type: IType
    date: string;
}