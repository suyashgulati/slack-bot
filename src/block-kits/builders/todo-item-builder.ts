import UserTodo from "../../db/entity/user-todo";

export default (todo: UserTodo) => ({
  "text": {
    "type": "mrkdwn",
    "text": todo.text,
  },
  "value": `${todo.id}`,
});