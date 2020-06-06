import { Repository, EntityRepository, getManager, LessThan } from "typeorm";
import { Service } from "typedi";
import User from "../entity/user";
import UserTodo from "../entity/user-todo";
import DailyEntry from "../entity/daily-entry";
import { map } from "lodash";
import { DsrExistsError, WfhExistsError, DsrMissingError, WfhMissingError } from "../../shared/errors/daily-entry-errors";
@Service()
@EntityRepository(DailyEntry)
export class DailyEntryRepository extends Repository<DailyEntry> {

    async saveWfhEntry(userId: string, date: string, tasks: string[]) {
        const lastDayEntry = await this.getLastDailyEntry(userId, date);
        if (lastDayEntry && !lastDayEntry.today) {
            throw new DsrMissingError('DSR missing for last day');
        }
        const todayEntry = await this.getTodayEntry(userId, date);
        if (todayEntry) {
            throw new WfhExistsError('WFH entry exists for today');
        }
        const user = new User(userId);
        const entry = new DailyEntry();
        entry.date = new Date(date);;
        entry.tasks = tasks;
        entry.user = user;
        const todos = map(tasks, task => new UserTodo(user, task));
        return getManager().transaction(async transaction => {
            await transaction.save(entry);
            await transaction.save(todos);
        });
    }

    async saveDsrEntry(userId: string, date: string, today: string[], challenges: string[], tomorrow: string[]) {
        const todayEntry = await this.getTodayEntry(userId, date);
        if (!todayEntry) {
            throw new WfhMissingError('WFH entry missing for today');
        }
        if (todayEntry && todayEntry.today) {
            throw new DsrExistsError('DSR entry exists for today');
        }
        let entry = await this.findOne({ where: { user: { id: userId }, date: new Date(date) } })
        entry.today = today;
        entry.challenges = challenges;
        entry.tomorrow = tomorrow;
        return getManager().transaction(async transaction => {
            await transaction.save(entry);
            await transaction.delete(UserTodo, { user: { id: userId } });
        });
    }

    async saveMessageId(userId: string, date: string, messageId: string) {
        let entry = await this.findOne({ where: { user: { id: userId }, date: new Date(date) } });
        entry.messageId = messageId;
        return this.save(entry);
    }

    getLastDailyEntry(userId: string, date?: string) {
        const dateObject = date ? new Date(date) : new Date();
        return this.findOne({ where: { user: { id: userId }, date: LessThan(dateObject) }, order: { id: "DESC" }, });
    }

    getTodayEntry(userId: string, date: string) {
        return this.findOne({ user: { id: userId }, date: new Date(date) });
    }
}