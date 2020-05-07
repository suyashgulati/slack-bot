import { Service } from "typedi";
import express from "express";
import { App, ExpressReceiver, LogLevel } from "@slack/bolt";
import homeView from './block-kits/home';
import Logger from "./shared/logger";
import UserTodo from "./db/entity/user-todo";
import axios from "axios";

@Service()
export default class SlackFactory {
  constructor(
    // private route: Route,
    private logger: Logger,
  ) { }
  app: App;
  expressApp;
  create() {
    // Initializes your app with your bot token and signing secret
    const expressReceiver = new ExpressReceiver({
      signingSecret: process.env.SLACK_SIGNING_SECRET,
    });

    this.expressApp = expressReceiver.app;

    this.expressApp.get('/', (req, res) => {
      res.send({ message: 'API works' });
    });
    this.expressApp.use('/files', express.static('files'));

    this.app = new App({
      token: process.env.SLACK_BOT_TOKEN,
      receiver: expressReceiver,
      logLevel: LogLevel.DEBUG,
    });

    this.app.use(async args => {
      this.logger.logPayload(args);
      args.next();
    });

    // this.route.register(this.app);
    return this.app;
  }

  async openModal(triggerId: string, block: any, callbackId: string) {
    try {
      const result = await this.app.client.views.open({
        token: process.env.SLACK_BOT_TOKEN,
        trigger_id: triggerId,
        view: block,
        callback_id: callbackId,
      });
    } catch (error) {
      console.error(error);
      console.error(error.data);
    }
  }

  async publishHome(userId: string, todos: UserTodo[]) {
    try {
      const result = await this.app.client.views.publish({
        user_id: userId,
        token: process.env.SLACK_BOT_TOKEN,
        view: homeView(userId, todos) as any
      });
    } catch (error) {
      console.error(error);
      console.error(error.data);
    }
  }

  async updateHome(userId: string, todos: UserTodo[]) {
    try {
      const result = await this.app.client.views.update({
        token: process.env.SLACK_BOT_TOKEN,
        external_id: `app_home_view_${userId}`,
        view: homeView(userId, todos) as any
      } as any);
    } catch (error) {
      console.error(error);
      console.error(error.data);
    }
  }


}