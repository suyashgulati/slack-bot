import { config } from "dotenv-safe";
import "reflect-metadata";
import DB from "./db";
import SlackFactory from './slack-app';
import { Container } from "typedi";
import CronJob from './cron-job';
import Route from "./route";
import MailService from "./shared/mailer/mail";

// env
config();
(async () => {
  let db = Container.get(DB);
  await db.init();

  let mailer = Container.get(MailService);
  mailer.init();

  let slackFactory = Container.get(SlackFactory);
  let slackApp = slackFactory.create();

  let route = Container.get(Route).register();

  slackApp.error(async (error) => {
    // Check the details of the error to handle special cases (such as stopping the app or retrying the sending of a message)
    console.error(error);
  });

  // Start your app
  await slackApp.start(process.env.PORT || 9000);
  console.log('⚡️ App is running!');

  let cronJob = Container.get(CronJob);
  cronJob.start();

})();
