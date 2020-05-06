import { Service } from "typedi";
import { App } from "@slack/bolt";
import Methods from "./methods";
import dsr from "./block-kits/dsr";
import wfh from "./block-kits/wfh";
import settings from "./block-kits/settings";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository, In, MoreThan, MoreThanOrEqual } from "typeorm";
import { UserRepository } from "./db/repository/user-repository";
import { UserSettingsRepository } from "./db/repository/user-settings-repository";
import _, { Dictionary } from "lodash";
// import userOptionBuilder from "./block-kits/builders/user-option-builder";
import WfhEntry from "./db/entity/wfh-entry";
import User from "./db/entity/user";
import DsrEntry from "./db/entity/dsr-entry";
import UserTodo from "./db/entity/user-todo";
import addItemModal from "./block-kits/add-task-modal";
import dsrMsg from "./block-kits/dsr-msg";
import wsrMsg from "./block-kits/wsr-msg";
import moment from "moment";
import { promises as fs } from 'fs';
import FSService from "./shared/fsService";

@Service()
export default class Route {
    // TODO: Shift magic values to one place
    constructor(
        private methods: Methods,
        @InjectRepository() private readonly userSettingsRepo: UserSettingsRepository,
        @InjectRepository() private readonly userRepo: UserRepository,
        // @InjectRepository(UserSettings) private userSettingsRepo: Repository<UserSettings>,
        @InjectRepository(WfhEntry) private wfhRepo: Repository<WfhEntry>,
        @InjectRepository(DsrEntry) private dsrRepo: Repository<DsrEntry>,
        @InjectRepository(UserTodo) private todoRepo: Repository<UserTodo>,
        private fsService: FSService,
    ) { }

    register(app: App) {
        app.event('app_home_opened', async ({ body, context }) => {
            const todos: UserTodo[] = await this.todoRepo.find({ where: { user: { id: body.event.user }, isActive: true }, order: { id: "ASC" }, take: 10 });
            await this.methods.publishHome(app, context.botToken, body.event.user, todos);
        });
        app.action('settings', async ({ body, ack, context }) => {
            await ack();
            let userSett = await this.userSettingsRepo.findOne({ where: { user: { id: body.user.id } } });
            let ccUsers = await (await this.userRepo.findOne({ where: { id: body.user.id } })).ccUsers;
            let b = settings(userSett.wfhTime, userSett.dsrTime, userSett.toUser, ccUsers);
            await this.methods.openModal(app, context.botToken, body['trigger_id'], b, 'settings')
        });
        app.action('dsr', async ({ body, ack, context }) => {
            await ack();
            const todos: UserTodo[] = await this.todoRepo.find({ where: { user: { id: body.user.id }, isActive: true }, order: { id: "ASC" }, take: 10 });
            await this.methods.openModal(app, context.botToken, body['trigger_id'], dsr(body.user.id, todos), 'dsr')
        });
        app.action('wfh', async ({ body, ack, context }) => {
            await ack();
            const lastDsrEntry = await this.dsrRepo.findOne({ where: { user: { id: body.user.id } }, order: { id: "DESC" }, });
            await this.methods.openModal(app, context.botToken, body['trigger_id'], wfh(body.user.id, lastDsrEntry?.tomorrow), 'wfh')
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
            const user = await this.userRepo.findOne({ where: { id: body.user.id } });
            user.ccUsers = Promise.resolve(_.map(action['selected_users'], userId => new User(userId)));
            this.userRepo.save(user);
            await ack();
        });
        app.action(/^.*_time/, async ({ ack, body, action }) => {
            const input = action['selected_option'].value;
            const actionId = action['action_id'];
            // TODO: Shift magic values to one place
            const userSett = await this.userSettingsRepo.findOne({ user: { id: body.user.id } });
            if (actionId === 'dsr_time') {
                userSett.dsrTime = input;
            } else if (actionId === 'wfh_time') {
                userSett.wfhTime = input;
            }
            this.userSettingsRepo.save(userSett);
            await ack();
        });
        app.action('home_todo', async ({ ack, body, action, client, context }) => {
            await ack();
            // TODO: Shift magic values to one place
            const todos: UserTodo[] = await this.todoRepo.find({ where: { user: { id: body.user.id }, isActive: true }, order: { id: "ASC" }, take: 10 });
            _.forEach(todos, todo => {
                const selected = _.some(action['selected_options'], op => todo.id === +op.value);
                todo.isComplete = selected;
            });
            this.todoRepo.save(todos);
            this.updateHome(app, context.botToken, body.user.id, todos);
        });
        app.action('add_task', async ({ ack, body, action, client, context }) => {
            await ack();
            await this.methods.openModal(app, context.botToken, body['trigger_id'], addItemModal(), 'add_task')
        });
        app.action('download_wsr', async ({ ack }) => {
            await ack();
        });
        app.view('wfh_modal', async ({ ack, body, context }) => {
            const input = body.view.state.values.wfh_block.wfh_input.value;
            const tasks = this.methods.splitInputToArray(input);
            const user = new User(body.user.id);
            // TODO: Shift magic values to one place
            const entry = new WfhEntry();
            entry.tasks = tasks;
            entry.user = user;
            this.wfhRepo.save(entry);
            const todos = _.map(tasks, task => new UserTodo(user, task));
            await this.todoRepo.save(todos);
            this.updateHome(app, context.botToken, body.user.id);
            await ack();
        });
        app.view('dsr_modal', async ({ ack, body, context }) => {
            const input = body.view.state.values;
            const entry = new DsrEntry();
            entry.today = this.methods.splitInputToArray(input.dsr_1_block.dsr_1_input.value);
            entry.challenges = this.methods.splitInputToArray(input.dsr_2_block.dsr_2_input.value);
            entry.tomorrow = this.methods.splitInputToArray(input.dsr_3_block.dsr_3_input.value);
            entry.user = new User(body.user.id);
            this.dsrRepo.save(entry);
            await this.todoRepo.delete({ user: { id: body.user.id } });
            this.updateHome(app, context.botToken, body.user.id);
            await ack();
        });
        app.view('add_task_modal', async ({ ack, body, context }) => {
            await ack();
            const input = body.view.state.values.add_task_block.add_task_input.value;
            const newTodo = new UserTodo(new User(body.user.id), input);
            await this.todoRepo.save(newTodo);
            this.updateHome(app, context.botToken, body.user.id);
        });
        app.command('/wsr', async ({ body, ack, respond }) => {
            await ack();
            const userId = body.user_id;
            const allSenders = await this.userSettingsRepo.findAllSenders(userId);
            if (_.isEmpty(allSenders)) {
                try {
                    respond({
                        text: 'You are not mapped by any user :sorry:',
                        response_type: 'ephemeral'
                    });
                } catch (err) {
                    console.log(err);
                }
            } else {
                const downloadUrl = await this.generateWSR(allSenders);
                this.respondToWSRCommand(respond, userId, downloadUrl);
            }
        });
        app.command('/wsr-user', async ({ command, body, ack, say, respond }) => {
            await ack();
            const userId = body.user_id;
            const allSenders = await this.userSettingsRepo.findAllSenders(userId);
            const userFromCommand = this.methods.getUserIdFromEscapedString(command.text);
            if (!userFromCommand) {
                respond({
                    text: 'Please add a user to the command, for example /wsr-user @User',
                    response_type: 'ephemeral'
                });
            } else if (!_.includes(allSenders, userFromCommand)) {
                respond({
                    text: 'The user you chose doesnt have you in their sender list',
                    response_type: 'ephemeral'
                });
            } else {
                const downloadUrl = await this.generateWSR([userFromCommand]);
                this.respondToWSRCommand(respond, userId, downloadUrl);
            }
        });
    }

    // Todo: Move to service.ts
    async updateHome(app: App, botToken: string, userId: string, todos?: UserTodo[]) {
        if (!todos) {
            todos = await this.todoRepo.find({ where: { user: { id: userId }, isActive: true }, order: { id: "ASC" }, take: 10 });
        }
        this.methods.updateHome(app, botToken, userId, todos);
    }

    respondToWSRCommand(respond, userId, downloadUrl) {
        try {
            respond({
                channel: userId,
                text: `Please download from <${downloadUrl}|here>`,
                blocks: wsrMsg(userId, `${process.env.PUBLIC_URL}${downloadUrl}`),
            });
        } catch (error) {
            console.error(error);
            console.error(error.data);
        }
    }

    async generateWSR(users: string[]): Promise<string> {
        let monday = moment().isoWeekday(1).startOf('day').toDate();
        let dsrs = await this.dsrRepo.find({ where: { user: { id: In(users) }, createdAt: MoreThanOrEqual(monday) } });
        return this.fsService.generateWSR(dsrs);
    }
}
