import { Service } from "typedi";
import homeView from './block-kits/home';
import { App } from "@slack/bolt";
import Task from "./shared/interfaces/task";
import UserTodo from "./db/entity/user-todo";

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

  async publishHome(app: App, botToken: string, userId: string, todos: UserTodo[]) {
    try {
      const result = await app.client.views.publish({
        user_id: userId,
        token: botToken,
        view: homeView(userId, todos) as any
      });
    } catch (error) {
      console.error(error);
      console.error(error.data);
    }
  }

  async updateHome(app: App, botToken: string, userId: string, todos: UserTodo[]) {
    try {
      const result = await app.client.views.update({
        token: botToken,
        // view_id: 'app_home_view',
        external_id: 'app_home_view',
        view: homeView(userId, todos) as any
      } as any);
    } catch (error) {
      console.error(error);
      console.error(error.data);
    }
  }

  splitInputToArray(tasks: string): string[] {
    return tasks ? tasks.split('\n').map(str => str.trim()) : [];
  }

  splitInputToTasks(tasks: string): Task[] {
    return tasks ? tasks.split('\n').map(str => ({ text: str.trim(), isComplete: false })) : [];
  }
}