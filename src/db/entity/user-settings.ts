import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import CommonEntity from "../common-entity";
import User from "./user";

@Entity()
export default class UserSettings extends CommonEntity {

    @ManyToOne(type => User)
    user: User;

    @Column()
    wfhTime: string;

    @Column()
    dsrTime: string;

    @ManyToOne(type => User)
    toUser: User;
    
    @ManyToMany(type => User)
    @JoinTable()
    ccUsers: User[];

}
