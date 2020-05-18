import * as nodemailer from 'nodemailer';
import { Service } from 'typedi';

@Service()
export default class MailService {
    private _transporter: nodemailer.Transporter;
    private _settings: ISystemSettings;

    constructor(settings: ISystemSettings) {
        this._settings = settings;
        this._transporter = nodemailer.createTransport(
            this._settings.SmtpServerConnectionString
        );
    }
    async sendMail(to: string, subject: string, content: string): Promise<void> {
        let options = {
            from: this._settings.SmtpFromAddress,
            to: to,
            subject: subject,
            text: content
        }
        try {
            await this._transporter.sendMail(options);
        } catch (e) {
            console.error('Error in sendMail in MailService', e);
        }
    }
}

export interface ISystemSettings {
    SmtpServerConnectionString: string;
    SmtpFromAddress: string;
} 