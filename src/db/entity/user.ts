import { Entity, Column } from "typeorm";
import CommonEntity from "../common-entity";

@Entity()
export default class User extends CommonEntity {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ length: 6, nullable: true })
    empId: string;

    @Column({ nullable: true })
    slackId: string;
}
