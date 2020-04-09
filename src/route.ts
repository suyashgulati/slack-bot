import { Service } from "typedi";
import SlackFactory from "./slack-app";
import Controller from "./controller";

@Service()
export default class Route {
    constructor(
        private ctrl: Controller,
    ) { }
    register(app) {
        app.event('app_home_opened', this.ctrl.home);
    }
}