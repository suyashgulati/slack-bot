import "reflect-metadata";
import { createConnection, useContainer } from "typeorm";
import { Container } from "typedi";

export default async () => {
    useContainer(Container);
    let conn = await createConnection(); 
}

