import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import CommonEntity from "../common-entity";
import User from "./user";
import Task from "../../shared/interfaces/task";

@Entity()
export default class WfhEntry extends CommonEntity {
    @ManyToOne(type => User)
    user: User;

    @Column('jsonb')
    tasks: Task[];
}
