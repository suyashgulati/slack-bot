import {MigrationInterface, QueryRunner, Repository, getRepository} from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import User from "../entity/user";
import { times } from "lodash";
import faker = require('faker');

export class initUserSeed1586990228607 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        console.log(123123);
        let users = times(20, () => {
            const user = new User();
            user.name = faker.name.firstName();
            user.email = faker.internet.email();
            return user;
        });
        await getRepository(User).save(users);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
