import { Repository, EntityRepository } from "typeorm";
import { Service } from "typedi";
import NodeCache from "node-cache";

import User from "../entity/user";

const CACHE_TTL = 60 * 60 * 1;
const ALL_USERS_KEY = 'ALL_USERS';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    usersCache: NodeCache;
    constructor() {
        super();
        this.usersCache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: CACHE_TTL * 0.2 });
    }

    findAll(): Promise<User[]> {
        if (this.usersCache.has(ALL_USERS_KEY)) {
            console.info('Got Users from cache');
            return this.usersCache.get(ALL_USERS_KEY);
        }
        const allUsersPromise = this.find();
        this.usersCache.set(ALL_USERS_KEY, allUsersPromise);
        return allUsersPromise;
    }
}