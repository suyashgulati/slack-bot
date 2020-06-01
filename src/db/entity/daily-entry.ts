import { Entity, Column, ManyToOne, Index } from "typeorm";
import CommonEntity from "../common-entity";
import User from "./user";

@Entity()
@Index(["user.id", "date"], { unique: true })
export default class DailyEntry extends CommonEntity {
    @ManyToOne(type => User, { eager: true })
    user: User;

    @Column({ type: Date })
    date: Date;

    @Column({ type: String, array: true })
    tasks: string[];

    @Column({ type: String, nullable: true })
    messageId?: string;

    @Column({ type: String, array: true, nullable: true })
    today?: string[];

    @Column({ type: String, array: true, nullable: true })
    challenges?: string[];

    @Column({ type: String, array: true, nullable: true })
    tomorrow?: string[];
}
