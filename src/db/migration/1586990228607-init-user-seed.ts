import { MigrationInterface, QueryRunner, Repository, getRepository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import User from "../entity/user";
import { times, random, sample } from "lodash";
import faker = require('faker');
import UserSettings from "../entity/user-settings";

export class initUserSeed1586990228607 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        let users = times(20, () => {
            const user = new User();
            user.name = faker.name.firstName();
            user.email = faker.internet.email();
            return user;
        });
        let savedUsers = await getRepository(User).save(users);
        console.log("initUserSeed1586990228607 -> savedUsers", savedUsers);
        let userSettings = savedUsers.map(x => {
            const userSett = new UserSettings();
            userSett.user = x;
            userSett.wfhTime = random(24).toString();
            userSett.dsrTime = random(24).toString();
            userSett.toUser = sample(savedUsers);
            userSett.ccUsers = [sample(savedUsers)];
            return userSett;
        });
        await getRepository(UserSettings).save(userSettings);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
