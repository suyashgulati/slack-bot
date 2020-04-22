import { Entity, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToOne } from "typeorm";
import CommonEntity from "../common-entity";
import User from "./user";
import { Time } from "../../shared/enums/time";

@Entity()
export default class UserSettings extends CommonEntity {

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @Column({
        type: "enum",
        enum: Time,
        nullable: true,
    })
    wfhTime: Time;

    @Column({
        type: "enum",
        enum: Time,
        nullable: true,
    })
    dsrTime: Time;

    @ManyToOne(type => User, { nullable: true })
    @JoinColumn()
    toUser: User;

    @ManyToMany(type => User, { nullable: true })
    @JoinTable()
    ccUsers: User[];

}
