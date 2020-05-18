import { Repository, EntityRepository, createQueryBuilder } from "typeorm";
import { Service } from "typedi";
import _ from "lodash";
import UserTodo from "../entity/user-todo";

@Service()
@EntityRepository(UserTodo)
export class UserTodoRepository extends Repository<UserTodo> {
    async getTodosForHome(userId: string): Promise<UserTodo[]> {
        return this.find({ where: { user: { id: userId }, isActive: true }, order: { id: "ASC" }, take: 10 });
    }
}