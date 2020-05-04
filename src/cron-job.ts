import { Service } from "typedi";
import cron from 'node-cron';
import { InjectRepository } from "typeorm-typedi-extensions";
import UserSettings from "./db/entity/user-settings";
import { Repository } from "typeorm";
import { forEach, round } from "lodash";
import moment from "moment";
import SlackFactory from "./slack-app";
import wfhMsg from "./block-kits/wfh-msg";
import dsrMsg from "./block-kits/dsr-msg";
import { KnownBlock, Block } from "@slack/types";

@Service()
export default class CronJob {
    constructor(
        @InjectRepository(UserSettings) private userSettingsRepo: Repository<UserSettings>,
        private slackFactory: SlackFactory,
    ) { }
    halfHourly = cron.schedule('*/30 * * * *', () => { this.halfHourlyTask(); }, { timezone: 'Asia/Kolkata' })

    start() {
        this.halfHourly.start();
        // Remove comment to test
        // this.halfHourlyTask();
    }

    async halfHourlyTask() {
        const now = moment().utc().add('h', 5).add('m', 30);
        const hour = now.hour();
        const minute = now.minute() > 30 ? 5 : 0;
        const nowTime = `${hour}.${minute}`;
        const allUserSettings = await this.userSettingsRepo.find();
        forEach(allUserSettings, async userSett => {
            let userId = userSett.user.id;
            if (userSett.wfhTime === nowTime) {
                this.sendMessage(userId, wfhMsg(userId))
            }
            if (userSett.dsrTime === nowTime) {
                this.sendMessage(userId, dsrMsg(userId))
            }
        });
    }

    async sendMessage(userId: string, blocks: (KnownBlock | Block)[]) {
        try {
            // Call the chat.scheduleMessage method with a token
            const result = await this.slackFactory.app.client.chat.postMessage({
                // The token you used to initialize your app is stored in the `context` object
                token: process.env.SLACK_BOT_TOKEN,
                channel: userId,
                text: 'Message',
                blocks
            });
        }
        catch (error) {
            console.error(error);
        }
    }
}
