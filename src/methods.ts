import { Service } from "typedi";
import ITask from "./shared/interfaces/task";

@Service()
export default class Methods {

  splitInputToArray(tasks: string): string[] {
    return tasks ? tasks.split('\n').map(str => str.trim()) : [];
  }

  splitInputToTasks(tasks: string): ITask[] {
    return tasks ? tasks.split('\n').map(str => ({ text: str.trim(), isComplete: false })) : [];
  }

  getUserIdFromEscapedString(str: string) {
    const regex = /\@(.*?)\|/g;
    const found = regex.exec(str);
    return found ? found[1] : null;
  }
}