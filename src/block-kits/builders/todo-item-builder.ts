import Task from "../../shared/interfaces/task";
import UserTodo from "../../db/entity/user-todo";

export default (todo: UserTodo, index: number) => ({
  "text": {
    "type": "mrkdwn",
    "text": todo.text,
  },
  "value": `${todo.id}`,
});