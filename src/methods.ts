import { Service } from "typedi";
import axios from 'axios';
import homeView from './block-kits/home';
import User from "./db/entity/user";
import { App } from "@slack/bolt";
import Task from "./shared/interfaces/task";

@Service()
export default class Methods {
  constructor() { }
  async openModal(app: App, botToken: string, triggerId: string, block: any, callbackId: string) {
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

  async publishHome(app: App, botToken: string, userId: string, tasks: Task[]) {
    try {
      const result = await app.client.views.publish({
        user_id: userId,
        token: botToken,
        view: homeView(userId, tasks) as any
      });
    } catch (error) {
      console.error(error);
      console.error(error.data);
    }
  }

  splitInputToArray(tasks: string): string[] {
    return tasks.split('\n').map(str => str.trim());
  }

  splitInputToTasks(tasks: string): Task[] {
    return tasks.split('\n').map(str => ({ text: str.trim(), isComplete: false }));
  }
}