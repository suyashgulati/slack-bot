import { Service } from "typedi";
import Controller from "./controller";
import { App } from "@slack/bolt";
import Methods from "./methods";
import dsr from "./block-kits/dsr";
import wfh from "./block-kits/wfh";
import settings from "./block-kits/settings";
import UserSettings from "./db/entity/user-settings";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";

@Service()
export default class Route {

    constructor(
        private ctrl: Controller,
        private methods: Methods,
        @InjectRepository(UserSettings) private userSettingsRepo: Repository<UserSettings>
    ) { }

    register(app: App) {
        app.event('app_home_opened', this.ctrl.home);
        app.action('settings', async ({ body, ack, context }) => {
            await ack();
            let userSett = await this.userSettingsRepo.findOne();
            console.log("Route -> register -> userSett", userSett)
            let b = settings(userSett.wfhTime, userSett.dsrTime, userSett.toUser, userSett.ccUsers);
            await this.methods.openModal(app, context.botToken, body['trigger_id'], b, 'settings')
        });
        app.action('dsr', async ({ body, ack, context }) => {
            await ack();
            await this.methods.openModal(app, context.botToken, body['trigger_id'], dsr(body.user.id), 'dsr')
        });
        app.action('wfh', async ({ body, ack, context }) => {
            await ack();
            await this.methods.openModal(app, context.botToken, body['trigger_id'], wfh(body.user.id), 'wfh')
        });
        app.action('cc_multi_select', async ({ ack, payload }) => {
            await ack();
            console.log(payload);
        });
    }
}


















        // app.message('hello', async ({ message, say }) => {
        //     // say() sends a message to the channel where the event was triggered
        //     await say({
        //         blocks: [
        //             {
        //                 "type": "section",
        //                 "text": {
        //                     "type": "mrkdwn",
        //                     "text": `Hey there <@${message.user}>!`
        //                 },
        //                 "accessory": {
        //                     "type": "button",
        //                     "text": {
        //                         "type": "plain_text",
        //                         "text": "Click Me"
        //                     },
        //                     "action_id": "button_click"
        //                 }
        //             }
        //         ]
        //     } as any);
        // });

        // app.action('button_click', async ({ body, ack, say }) => {
        //     // Acknowledge the action
        //     await ack();
        //     await say(`<@${body.user.id}> clicked the button`);
        // });
