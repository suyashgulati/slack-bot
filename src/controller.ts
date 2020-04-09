import { Service } from "typedi";
import { SlackEventMiddlewareArgs } from "@slack/bolt/dist/types";
import Services from "./services";

@Service()
export default class Controller {
    constructor(private services: Services) { }
    async home<T extends string>(data: SlackEventMiddlewareArgs<T>) {
        console.log("Controller -> constructor -> this.services.displayHome", this.services.displayHome)
        this.services.displayHome(data.payload.user)
    }
}