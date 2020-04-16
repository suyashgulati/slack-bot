import { Service } from "typedi";
import axios from 'axios';
import updateHomeView from './block-kits/home';

@Service()
export default class Methods {
  constructor() { }
  async openModal(app, botToken, triggerId, block, callbackId) {
    try {
      const result = await app.client.views.open({
        token: botToken,
        trigger_id: triggerId,
        view: block,
        callback_id: callbackId,
      });
    } catch (error) {
      console.error(error);
      console.error(error.data);
    }
  }
}