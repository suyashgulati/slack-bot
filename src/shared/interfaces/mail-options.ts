export default interface IMailOptions {
    user: string;
    to: string;
    cc: string[];
    subject: string;
    html: string;
    messageId?: string;
}