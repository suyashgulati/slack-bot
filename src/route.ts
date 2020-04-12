import { Service } from "typedi";
import Controller from "./controller";
import { App } from "@slack/bolt";
import Methods from "./methods";
import dsrView from "./block-kits/dsr";

@Service()
export default class Route {

    constructor(
        private ctrl: Controller,
        private methods: Methods,
    ) { }
    
    register(app: App) {
        app.event('app_home_opened', this.ctrl.home);
        app.action('dsr', async ({ body, ack, context }) => {
            await ack();
            await this.methods.openModal(app, context.botToken, body['trigger_id'], dsrView(body.user.id), 'dsr')
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
