import { Service } from "typedi";
import { SlackEventMiddlewareArgs } from "@slack/bolt/dist/types";
import Services from "./services";
import SlackFactory from "./slack-app";
import wfhview from "./block-kits/wfh";

@Service()
export default class Controller {
    constructor(private services: Services,
        private slackFactory: SlackFactory) { }
    async home<T extends string>(data: SlackEventMiddlewareArgs<T>) {
        console.log("Controller -> constructor -> this.services.displayHome", this.services.displayHome)
        this.services.displayHome(data.payload.user)
    }
    async wfh({ ack, payload, context, say }) {
        console.log(payload);
        await ack();
        await say('Helllloooo');
        // await this.slackFactory.openModal(context.botToken, payload.trigger_id, wfhview(), 'wfh');
    }
}