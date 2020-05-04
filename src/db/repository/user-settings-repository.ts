import { Repository, EntityRepository, createQueryBuilder } from "typeorm";
import { Service } from "typedi";
import UserSettings from "../entity/user-settings";
import _ from "lodash";
import { InjectRepository } from "typeorm-typedi-extensions/decorators/InjectRepository";
import { UserRepository } from "./user-repository";
import User from "../entity/user";

@Service()
@EntityRepository(UserSettings)
export class UserSettingsRepository extends Repository<UserSettings> {
    constructor(
        @InjectRepository() private readonly userRepo: UserRepository, ) {
        super();
    }
    async findAllSenders(userId: string): Promise<string[]> {
        const usersWhoToed = await this.find({ where: { toUser: { id: userId } } });
        const usersWhoCCed = await this.query('select cum.user as id from cc_users_map cum where cum.cc_user = $1', [userId]);
        return _.uniq(_.concat(_.map(usersWhoToed, 'user.id'), _.map(usersWhoCCed, 'id')));
    }
}