import { Repository, EntityRepository, createQueryBuilder, getManager } from "typeorm";
import { Service } from "typedi";
import UserSettings from "../entity/user-settings";
import _ from "lodash";
import { InjectRepository } from "typeorm-typedi-extensions/decorators/InjectRepository";
import { UserRepository } from "./user-repository";
import User from "../entity/user";
import UserTodo from "../entity/user-todo";
import WfhEntry from "../entity/wfh-entry";
import DB from "..";

@Service()
@EntityRepository(WfhEntry)
export class WfhEntryRepository extends Repository<WfhEntry> {

    saveWfhEntry(userId: string, date: string, tasks: string[]) {
        const user = new User(userId);
        const entry = new WfhEntry();
        entry.date = date;
        entry.tasks = tasks;
        entry.user = user;
        const todos = _.map(tasks, task => new UserTodo(user, task));
        return getManager().transaction(async transaction => {
            await transaction.save(entry);
            await transaction.save(todos);
        });
    }
}