import { Service } from "typedi";
import Controller from "./controller";
import { App } from "@slack/bolt";

@Service()
export default class Route {
    constructor(
        private ctrl: Controller,
    ) { }
    register(app: App) {
        app.event('app_home_opened', this.ctrl.home);
        app.command('/wfh', async ({ ack, payload, context, say }) => {
            console.log(payload);
            await ack();
            await say('Helllloooo');
            // await this.slackFactory.openModal(context.botToken, payload.trigger_id, wfhview(), 'wfh');
        });
    }
}