import { Entity, Column, ManyToOne } from "typeorm";
import CommonEntity from "../common-entity";
import User from "./user";

@Entity()
export default class DsrEntry extends CommonEntity {
    @ManyToOne(type => User)
    user: User;

    @Column("text")
    today: string;

    @Column("text")
    challenges: string;

    @Column("text")
    tomorrow: string;
}
