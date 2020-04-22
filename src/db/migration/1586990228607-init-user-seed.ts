import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import User from "../entity/user";
import { times, sample } from "lodash";
import * as faker from 'faker';
import UserSettings from "../entity/user-settings";
import { Time } from "../../shared/enums/time";

export class initUserSeed1586990228607 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        // let users = times(20, () => {
        //     const user = new User();
        //     user.name = faker.name.firstName();
        //     user.email = faker.internet.email();
        //     return user;
        // });
        
        // let savedUsers = await getRepository(User).save(users);
        // let userSettings = savedUsers.map(x => {
        //     const userSett = new UserSettings();
        //     userSett.user = x;
        //     userSett.wfhTime = sample(Time);
        //     userSett.dsrTime = sample(Time);
        //     // userSett.toUser = sample(savedUsers);
        //     // userSett.ccUsers = [x];
        //     return userSett;
        // });
        // await getRepository(UserSettings).save(userSettings);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
