import { Service } from "typedi";
import { App, ExpressReceiver } from "@slack/bolt";
import Route from "./route";

@Service()
export default class SlackFactory {
  constructor(
    private route: Route,
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
    })

    this.app = new App({
      token: process.env.SLACK_BOT_TOKEN,
      receiver: expressReceiver,
      // logLevel: LogLevel.DEBUG,
    });
    this.route.register(this.app);
    return this.app;
  }

  async openModal(botToken, triggerId, block, callbackId) {
    try {
      const result = await this.app.client.views.open({
        token: botToken,
        trigger_id: triggerId,
        view: block,
        callback_id: callbackId,
      });
    } catch (error) {
      console.error(error);
    }
  }
}