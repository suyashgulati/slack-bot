import { Service } from "typedi";
import { App } from "@slack/bolt";
import Methods from "./methods";
import dsrBlockKit from "./block-kits/dsr";
import wfhBlockKit from "./block-kits/wfh";
import settings from "./block-kits/settings";
import { InjectRepository } from "typeorm-typedi-extensions";
import { In, MoreThanOrEqual } from "typeorm";
import { UserRepository } from "./db/repository/user-repository";
import { UserSettingsRepository } from "./db/repository/user-settings-repository";
import _ from "lodash";
import User from "./db/entity/user";
import addItemModal from "./block-kits/add-task-modal";
import wsrMsg from "./block-kits/wsr-msg";
import moment from "moment";
import FSService from "./shared/fsService";
import SlackFactory from "./slack-app";
import { UserTodoRepository } from "./db/repository/user-todo-repository";
import { WfhEntryRepository } from "./db/repository/wfh-entry-repository";
import { DsrEntryRepository } from "./db/repository/dsr-entry-repository";
import UserTodo from "./db/entity/user-todo";
import MailService from "./shared/mailer/mail";
import dsrMail from "./shared/mailer/templates/dsr-mail";
import wfhMail from "./shared/mailer/templates/wfh-mail";
import IMailOptions from "./shared/interfaces/mail-options";

@Service()
export default class Route {
    app: App;
    // TODO: Shift magic values to one place
    constructor(
        private methods: Methods,
        @InjectRepository() private readonly userSettingsRepo: UserSettingsRepository,
        @InjectRepository() private readonly userRepo: UserRepository,
        @InjectRepository() private readonly todoRepo: UserTodoRepository,
        @InjectRepository() private readonly wfhRepo: WfhEntryRepository,
        @InjectRepository() private readonly dsrRepo: DsrEntryRepository,
        private fsService: FSService,
        private slackFactory: SlackFactory,
        private mailService: MailService,
    ) {
        this.app = this.slackFactory.app;
    }

    register() {
        this.app.event('app_home_opened', async ({ body, context }) => {
            const todos: UserTodo[] = await this.todoRepo.getTodosForHome(body.event.user);
            await this.slackFactory.publishHome(body.event.user, todos);
        });
        this.app.action('settings', async ({ body, ack, context }) => {
            await ack();
            let userSett = await this.userSettingsRepo.getUserSettings(body.user.id);
            let ccUsers = await (await this.userRepo.findOne({ where: { id: body.user.id } })).ccUsers;
            let b = settings(userSett.wfhTime, userSett.dsrTime, userSett.toUser, ccUsers);
            await this.slackFactory.openModal(body['trigger_id'], b, 'settings')
        });
        this.app.action('dsr', async ({ body, ack, context }) => {
            await ack();
            const todos: UserTodo[] = await this.todoRepo.getTodosForHome(body.user.id);
            await this.slackFactory.openModal(body['trigger_id'], dsrBlockKit(body.user.id, todos), 'dsr')
        });
        this.app.action('wfh', async ({ body, ack, context }) => {
            await ack();
            const lastDsrEntry = await this.dsrRepo.findOne({ where: { user: { id: body.user.id } }, order: { id: "DESC" }, });
            await this.slackFactory.openModal(body['trigger_id'], wfhBlockKit(body.user.id, lastDsrEntry?.tomorrow), 'wfh')
        });
        this.app.action('user_to', async ({ ack, body, action }) => {
            await ack();
            // TODO: Shift magic values to one place
            this.userSettingsRepo.saveSelectedToUser(body.user.id, action['selected_user']);
        });
        this.app.action('user_cc', async ({ ack, body, action }) => {
            await ack();
            // TODO: Shift magic values to one place
            this.userRepo.saveSelectedCCUsers(body.user.id, action['selected_users']);
        });
        this.app.action(/^.*_time/, async ({ ack, body, action }) => {
            await ack();
            const input = action['selected_option'].value;
            const actionId = action['action_id'];
            // TODO: Shift magic values to one place
            this.userSettingsRepo.saveTime(body.user.id, actionId, input);
        });
        this.app.action('home_todo', async ({ ack, body, action, client, context }) => {
            await ack();
            // TODO: Shift magic values to one place
            const todos: UserTodo[] = await await this.todoRepo.getTodosForHome(body.user.id);
            _.forEach(todos, todo => {
                const selected = _.some(action['selected_options'], op => todo.id === +op.value);
                todo.isComplete = selected;
            });
            this.todoRepo.save(todos);
            this.updateHome(body.user.id, todos);
        });
        this.app.action('add_task', async ({ ack, body, action, client, context }) => {
            await ack();
            await this.slackFactory.openModal(body['trigger_id'], addItemModal(), 'add_task')
        });
        this.app.action('download_wsr', async ({ ack }) => {
            await ack();
        });
        this.app.view('wfh_modal', async ({ ack, body, context }) => {
            await ack();
            // TODO: Shift magic values to one place
            const input = body.view.state.values;
            const date = input.wfh_date_block.wfh_date_input.selected_date;
            const tasks = this.methods.splitInputToArray(input.wfh_block.wfh_input.value);
            const mailResult = await this.mailService.sendMail(await this.getWFHMailObject(body.user.id, date, tasks));
            await this.wfhRepo.saveWfhEntry(body.user.id, date, tasks, mailResult.messageId);
            this.updateHome(body.user.id);
        });
        this.app.view('dsr_modal', async ({ ack, body, context }) => {
            await ack();
            const input = body.view.state.values;
            const date = input.dsr_date_block.dsr_date_input.selected_date;
            const today = this.methods.splitInputToArray(input.dsr_1_block.dsr_1_input.value);
            const challenges = this.methods.splitInputToArray(input.dsr_2_block.dsr_2_input.value);
            const tomorrow = this.methods.splitInputToArray(input.dsr_3_block.dsr_3_input.value);
            await this.mailService.sendMail(await this.getDSRMailObject(body.user.id, date, today, challenges, tomorrow));
            await this.dsrRepo.saveDsrEntry(body.user.id, date, today, challenges, tomorrow);
            this.updateHome(body.user.id);
        });
        this.app.view('add_task_modal', async ({ ack, body, context }) => {
            await ack();
            const input = body.view.state.values.add_task_block.add_task_input.value;
            const newTodo = new UserTodo(new User(body.user.id), input);
            await this.todoRepo.save(newTodo);
            this.updateHome(body.user.id);
        });

        //TODO: need to refactor these 2 routes
        this.app.command('/wsr', async ({ body, ack, respond }) => {
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
        this.app.command('/wsr-user', async ({ command, body, ack, say, respond }) => {
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
    async updateHome(userId: string, todos?: UserTodo[]) {
        if (!todos) {
            todos = await this.todoRepo.getTodosForHome(userId);
        }
        this.slackFactory.updateHome(userId, todos);
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

    async getMailRecepients(userId) {
        let userSett = await this.userSettingsRepo.getUserSettings(userId);
        console.log('getMailRecepients -> userSett', userSett);
        let ccUsers = await (await this.userRepo.findOne({ where: { id: userId } })).ccUsers;
        return {
            user: userSett.user,
            to: userSett.toUser,
            cc: ccUsers,
        }
    }

    getMailSubject(sender: string, date: string) { return `${sender} - ${date} - Work Status` }

    async getWFHMailObject(userId: string, date: string, tasks: string[]): Promise<IMailOptions> {
        const { user, to, cc } = await this.getMailRecepients(userId);
        return {
            user: user.name,
            to: to.email,
            cc: cc.map(u => u.email),
            subject: this.getMailSubject(user.name, date),
            html: wfhMail(tasks),
        }
    }

    async getDSRMailObject(userId: string, date: string, today: string[], challenges: string[], tomorrow: string[]): Promise<IMailOptions> {
        const { user, to, cc } = await this.getMailRecepients(userId);
        const messageId = (await this.wfhRepo.getWfhForSameDate(userId, date)).messageId;
        return {
            user: user.name,
            to: to.email,
            cc: cc.map(u => u.email),
            subject: this.getMailSubject(user.name, date),
            html: dsrMail(today, challenges, tomorrow),
            messageId
        }
    }
}
