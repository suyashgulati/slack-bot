import * as nodemailer from 'nodemailer';
import { Service } from 'typedi';
import { google } from 'googleapis';
import Mail from 'nodemailer/lib/mailer';
import IMailOptions from '../interfaces/mail-options';
const OAuth2 = google.auth.OAuth2;

@Service()
export default class MailService {
    private _transporter: nodemailer.Transporter;
    private oauth2Client: any;

    init() {
        this.oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_SECRET_KEY,
            'https://developers.google.com/oauthplayground',
        );
        this.oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        });
        this._transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_SECRET_KEY,
            },
        });
    }

    async sendMail(mailOptions: IMailOptions) {
        const accessToken = await this.oauth2Client.getAccessToken();
        const options = {
            from: process.env.GOOGLE_SENDER_EMAIL,
            auth: {
                user: process.env.GOOGLE_SENDER_EMAIL,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken,
            },
            // TODO: sender, Didn't work!
            ...mailOptions,
        };
        try {
            let result = await this._transporter.sendMail(options);
            return result;
        } catch (e) {
            console.error('Error in sendMail in MailService', e);
            return false;
        }
    }

}
