import { Entity, Column, ManyToOne } from "typeorm";
import CommonEntity from "../common-entity";
import User from "./user";
import Task from "../../shared/interfaces/task";

@Entity()
export default class DsrEntry extends CommonEntity {
    @ManyToOne(type => User, { eager: true })
    user: User;

    @Column({ type: String })
    date: string;

    @Column({ type: String, array: true })
    today: string[];

    @Column({ type: String, array: true, nullable: true })
    challenges?: string[];

    @Column({ type: String, array: true, nullable: true })
    tomorrow: string[];
}
