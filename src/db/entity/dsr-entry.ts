import { Entity, Column, ManyToOne } from "typeorm";
import CommonEntity from "../common-entity";
import User from "./user";
import Task from "../../shared/interfaces/task";

@Entity()
export default class DsrEntry extends CommonEntity {
    @ManyToOne(type => User)
    user: User;

    @Column('text', { array: true })
    today: string[];

    @Column('text', { array: true })
    challenges: string[];

    @Column('text', { array: true })
    tomorrow: string[];
}
