import { Repository, EntityRepository, createQueryBuilder } from "typeorm";
import { Service } from "typedi";
import UserSettings from "../entity/user-settings";
import _ from "lodash";
import { InjectRepository } from "typeorm-typedi-extensions/decorators/InjectRepository";
import { UserRepository } from "./user-repository";
import User from "../entity/user";
import { Time } from "../../shared/enums/time";

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

    async getUserSettings(userId: string): Promise<UserSettings> {
        return this.findOne({ user: { id: userId } });
    }

    async saveSelectedToUser(userId: string, toUserId: string) {
        const userSett = await this.getUserSettings(userId);
        userSett.toUser = new User(toUserId);
        this.save(userSett);
    }

    async saveTime(userId: string, type: 'dsr_time' | 'wfh_time', value: Time) {
        const userSett = await this.getUserSettings(userId);
        if (type === 'dsr_time') {
            userSett.dsrTime = value;
        } else if (type === 'wfh_time') {
            userSett.wfhTime = value;
        }
        this.save(userSett);
    }
}