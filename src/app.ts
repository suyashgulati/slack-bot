import { config } from "dotenv-safe";
import "reflect-metadata";
import SlackFactory from './slack-app';
import { Container } from "typedi";
import initDb from './db';
import CronJob from './cron-job';

// env
config();
(async () => {
  await initDb();

  let slackFactory = Container.get(SlackFactory);
  let slackApp = slackFactory.create();
  
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