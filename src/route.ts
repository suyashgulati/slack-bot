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
import { UserRepository } from "./db/repository/user-repository";
import _ from "lodash";
// import userOptionBuilder from "./block-kits/builders/user-option-builder";
import WfhEntry from "./db/entity/wfh-entry";
import User from "./db/entity/user";
import DsrEntry from "./db/entity/dsr-entry";
@Service()
export default class Route {
    // TODO: Shift magic values to one place
    constructor(
        private methods: Methods,
        @InjectRepository(UserSettings) private userSettingsRepo: Repository<UserSettings>,
        @InjectRepository(WfhEntry) private wfhRepo: Repository<WfhEntry>,
        @InjectRepository(DsrEntry) private dsrRepo: Repository<DsrEntry>,
        @InjectRepository() private readonly userRepo: UserRepository,
    ) { }

    register(app: App) {
        app.event('app_home_opened', async ({ body, context }) => {
            const todayWfh = await this.wfhRepo.findOne({ where: { user: { id: body.event.user } }, order: { createdAt: "DESC" } });
            await this.methods.publishHome(app, context.botToken, body.event.user, todayWfh.tasks);
        });
        app.action('settings', async ({ body, ack, context }) => {
            await ack();
            let userSett = await this.userSettingsRepo.findOne({ where: { user: { id: body.user.id } } });
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
        app.action('user_to', async ({ ack, body, action }) => {
            // TODO: Shift magic values to one place
            const userSett = await this.userSettingsRepo.findOne({ user: { id: body.user.id } });
            userSett.toUser = new User(action['selected_user']);
            this.userSettingsRepo.save(userSett);
            await ack();
        });
        app.action('user_cc', async ({ ack, body, action }) => {
            // TODO: Shift magic values to one place
            const userSett = await this.userSettingsRepo.findOne({ user: { id: body.user.id } });
            userSett.ccUsers = _.map(action['selected_users'], userId => new User(userId));
            this.userSettingsRepo.save(userSett);
            await ack();
        });
        app.view('wfh_modal', async ({ ack, body }) => {
            const input = body.view.state.values.wfh_block.wfh_input.value;
            // TODO: Shift magic values to one place
            const entry = new WfhEntry();
            entry.tasks = this.methods.splitInputToTasks(input);
            entry.user = new User(body.user.id);
            this.wfhRepo.save(entry);
            await ack();
        });
        app.view('dsr_modal', async ({ ack, body }) => {
            const input = body.view.state.values;
            const entry = new DsrEntry();
            entry.today = this.methods.splitInputToTasks(input.dsr_1_block.dsr_1_input.value);
            entry.challenges = this.methods.splitInputToArray(input.dsr_2_block.dsr_2_input.value);
            entry.tomorrow = this.methods.splitInputToTasks(input.dsr_3_block.dsr_3_input.value);
            entry.user = new User(body.user.id);
            this.dsrRepo.save(entry);
            await ack();
        });
    }
}


// app.options({ 'action_id': /^all_user.*/ }, async ({ context, ack, body }) => {
//     console.log("Route -> register -> context", context)
//     console.log("Route -> register -> body", body)
//     let allUsers = await this.userRepo.findAll();
//     const options = _.chain(allUsers)
//         .filter(user => user.name.toLowerCase().includes(body.value.toLowerCase()))
//         .map(userOptionBuilder);
//     await ack({ options: options as any });
// });