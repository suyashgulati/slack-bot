import { config } from 'dotenv';
import "reflect-metadata";
import Container from 'typedi';
import SlackFactory from './slack-app';

// env
config();

let slackFactory = Container.get(SlackFactory);
let slackApp = slackFactory.create();

(async () => {
  slackApp.error(async (error) => {
    // Check the details of the error to handle special cases (such as stopping the app or retrying the sending of a message)
    console.error(error);
  });
  // Start your app
  await slackApp.start(process.env.PORT || 9000);
  console.log('⚡️ App is running!');

})();