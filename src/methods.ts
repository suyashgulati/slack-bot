import { Service } from "typedi";
import { App } from "@slack/bolt";
import Task from "./shared/interfaces/task";
import UserTodo from "./db/entity/user-todo";

@Service()
export default class Methods {
  constructor() { }

  splitInputToArray(tasks: string): string[] {
    return tasks ? tasks.split('\n').map(str => str.trim()) : [];
  }

  splitInputToTasks(tasks: string): Task[] {
    return tasks ? tasks.split('\n').map(str => ({ text: str.trim(), isComplete: false })) : [];
  }

  getUserIdFromEscapedString(str: string) {
    const regex = /\@(.*?)\|/g;
    const found = regex.exec(str);
    return found ? found[1] : null;
  }
}