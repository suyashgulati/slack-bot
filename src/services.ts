import { Service } from "typedi";
import axios from 'axios';
import updateHomeView from './block-kits/home';

@Service()
export default class Services {
    constructor() { }
    displayHome(user: string): Promise<any> {
        const args = {
          token: process.env.SLACK_BOT_TOKEN,
          user_id: user,
          view: updateHomeView(user)
        };
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        }
        console.log('https://slack.com/api/views.publish', args, { headers })
        return axios.post('https://slack.com/api/views.publish', args, { headers });
      };
}