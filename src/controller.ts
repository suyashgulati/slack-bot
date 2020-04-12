import { Service } from "typedi";
import axios from 'axios';
import updateHomeView from './block-kits/home';

@Service()
export default class Controller {
  constructor() { }
  async home(data) {
    console.log("Controller -> home -> data.payload.user", data.payload.user);
    const user = data.payload.user;
    const args = {
      token: process.env.SLACK_BOT_TOKEN,
      user_id: user,
      view: updateHomeView(user)
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    }
    axios.post('https://slack.com/api/views.publish', args, { headers });
  }

  async wfh({ ack, payload, context, say }) {
    console.log(payload);
    await ack();
    await say('Helllloooo');
    // await this.slackFactory.openModal(context.botToken, payload.trigger_id, wfhview(), 'wfh');
  }
}