import { Service } from "typedi";
import express from "express";
import { App, ExpressReceiver, LogLevel } from "@slack/bolt";
import Route from "./route";
import Logger from "./shared/logger";

@Service()
export default class SlackFactory {
  constructor(
    private route: Route,
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

    this.route.register(this.app);
    return this.app;
  }
}