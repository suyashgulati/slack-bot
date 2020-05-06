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
import DsrEntry from "../entity/dsr-entry";

@Service()
@EntityRepository(DsrEntry)
export class DsrEntryRepository extends Repository<DsrEntry> {
    saveDsrEntry(userId: string, today: string[], challenges: string[], tomorrow: string[]) {
        const entry = new DsrEntry();
        entry.today = today;
        entry.challenges = challenges;
        entry.tomorrow = tomorrow;
        entry.user = new User(userId);
        return getManager().transaction(async transactionalEntityManager => {
            await transactionalEntityManager.save(entry);
            await transactionalEntityManager.delete(UserTodo, { user: { id: userId } });
        });
    }
}