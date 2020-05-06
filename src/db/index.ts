import "reflect-metadata";
import { createConnection, useContainer, Connection } from "typeorm";
import { Container, Service } from "typedi";
@Service()
export default class DB {
    conn: Connection;
    async init() {
        useContainer(Container);
        this.conn = await createConnection();
    }
}
