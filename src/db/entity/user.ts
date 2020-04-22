import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";
import CommonEntity from "../common-entity";

@Entity()
export default class User {

    constructor(id?: string) {
        if (id) {
            this.id = id;
        }
    }

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ length: 6, nullable: true, unique: true })
    empId?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
