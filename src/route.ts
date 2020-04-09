import { Service } from "typedi";
import Controller from "./controller";
import { App } from "@slack/bolt";

@Service()
export default class Route {
    constructor(
        private ctrl: Controller,
    ) { }
    register(app: App) {
        app.event('app_home_opened', this.ctrl.home);
    }
}