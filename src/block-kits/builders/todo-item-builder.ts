import Task from "../../shared/interfaces/task";

export default (task: Task, index: number) => ({
  "text": {
    "type": "mrkdwn",
    "text": task.text,
  },
  "value": `${index}`,
});