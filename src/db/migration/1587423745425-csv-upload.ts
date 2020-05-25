import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { times, sample } from "lodash";
import User from "../entity/user";
import UserSettings from "../entity/user-settings";
import { Time } from "../../shared/enums/time";
import * as faker from 'faker';
import { ICsvUser } from "../../shared/interfaces/csv-user";
const csv = require('csvtojson')

export class csvUpload1587423745425 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const csvFilePath = `${process.cwd()}/slack-users.csv`;
        const usersData: ICsvUser[] = await csv().fromFile(csvFilePath);
        const users = usersData.filter(({ status }) => status !== 'Bot')
            .map((csvUser) => {
                const user = new User();
                user.name = csvUser.fullname;
                user.email = csvUser.email;
                user.id = csvUser.userid;
                user.email = csvUser.email;
                return user;
            });
        let savedUsers = await getRepository(User).save(users);
        let userSettings = savedUsers.map(x => {
            const userSett = new UserSettings();
            userSett.user = x;
            userSett.wfhTime = sample(Time);
            userSett.dsrTime = sample(Time);
            return userSett;
        });
        await getRepository(UserSettings).save(userSettings);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
