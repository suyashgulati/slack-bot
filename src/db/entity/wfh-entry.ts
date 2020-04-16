import { Entity, Column, ManyToOne } from "typeorm";
import CommonEntity from "../common-entity";
import User from "./user";

@Entity()
export default class WfhEntry extends CommonEntity {
    @ManyToOne(type => User)
    user: User;

    @Column("simple-array")
    tasks: string[];
}
