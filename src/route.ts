import { Service } from "typedi";
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
import UserTodo from "./db/entity/user-todo";
import addItemModal from "./block-kits/add-task-modal";
@Service()
export default class Route {
    // TODO: Shift magic values to one place
    constructor(
        private methods: Methods,
        @InjectRepository(UserSettings) private userSettingsRepo: Repository<UserSettings>,
        @InjectRepository(WfhEntry) private wfhRepo: Repository<WfhEntry>,
        @InjectRepository(DsrEntry) private dsrRepo: Repository<DsrEntry>,
        @InjectRepository(UserTodo) private todoRepo: Repository<UserTodo>,
        @InjectRepository() private readonly userRepo: UserRepository,
    ) { }

    register(app: App) {
        app.event('app_home_opened', async ({ body, context }) => {
            const todos: UserTodo[] = await this.todoRepo.find({ where: { user: { id: body.event.user }, isActive: true }, order: { id: "ASC" }, take: 10 });
            await this.methods.publishHome(app, context.botToken, body.event.user, todos);
        });
        app.action('settings', async ({ body, ack, context }) => {
            await ack();
            let userSett = await this.userSettingsRepo.findOne({ where: { user: { id: body.user.id } } });
            let b = settings(userSett.wfhTime, userSett.dsrTime, userSett.toUser, userSett.ccUsers);
            await this.methods.openModal(app, context.botToken, body['trigger_id'], b, 'settings')
        });
        app.action('dsr', async ({ body, ack, context }) => {
            await ack();
            const todos: UserTodo[] = await this.todoRepo.find({ where: { user: { id: body.user.id }, isActive: true }, order: { id: "ASC" }, take: 10 });
            await this.methods.openModal(app, context.botToken, body['trigger_id'], dsr(body.user.id, todos), 'dsr')
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
            const input = body.view.state.values.add_task_block.add_task_input.value;
            const newTodo = new UserTodo(new User(body.user.id), input);
            await this.todoRepo.save(newTodo);
            this.updateHome(app, context.botToken, body.user.id);
            await ack();
        });
    }

    // Todo: Move to service.ts
    async updateHome(app: App, botToken: string, userId: string, todos?: UserTodo[]) {
        if (!todos) {
            todos = await this.todoRepo.find({ where: { user: { id: userId }, isActive: true }, order: { id: "ASC" }, take: 10 });
        }
        this.methods.updateHome(app, botToken, userId, todos);
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