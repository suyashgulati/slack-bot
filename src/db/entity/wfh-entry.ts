import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import CommonEntity from "../common-entity";
import User from "./user";

@Entity()
export default class WfhEntry extends CommonEntity {
    @ManyToOne(type => User, { eager: true })
    user: User;

    @Column({ type: String })
    date: string;

    @Column({ type: String, array: true })
    tasks: string[];

    @Column({type: String})
    messageId: string;
}

