import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToMany, JoinTable } from "typeorm";
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

    @ManyToMany(type => User, { nullable: true, lazy: true })
    @JoinTable({
        name: "cc_users_map",
        joinColumn: {
            name: "user",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "cc_user",
            referencedColumnName: "id"
        }
    })
    ccUsers?: Promise<User[]>;
}
