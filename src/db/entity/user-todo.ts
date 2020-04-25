import { Entity, Column, ManyToOne } from "typeorm";
import CommonEntity from "../common-entity";
import User from "./user";

@Entity()
export default class UserTodo extends CommonEntity {

    constructor(user: User, text: string) {
        super();
        this.user = user;
        this.text = text;
        this.isComplete = false;
        this.isActive = true;
    }

    @ManyToOne(type => User)
    user: User;

    @Column('text')
    text: string;

    @Column('boolean')
    isComplete: boolean;

    @Column('boolean')
    isActive: boolean;
}
