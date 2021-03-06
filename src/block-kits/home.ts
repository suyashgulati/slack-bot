import { map, chain } from 'lodash';
import todoItemBuilder from './builders/todo-item-builder';
import UserTodo from '../db/entity/user-todo';

export default (userId: string, todos: UserTodo[]) => {
  const allOptions = map(todos, todoItemBuilder);
  const completedOptions = chain(todos).filter({ isComplete: true }).map(todoItemBuilder).value();
  const view = {
    "type": "home",
    "external_id": `app_home_view_${userId}`,
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*Hi <@${userId}> !*`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Settings :gear:",
            "emoji": true
          },
          "value": "settings",
          "action_id": "settings"
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Add WFH",
              "emoji": true
            },
            "value": "wfh",
            "action_id": "wfh"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Add DSR",
              "emoji": true
            },
            "value": "dsr",
            "action_id": "dsr"
          }
        ]
      },
      //* Adding blocks only if todo list exists
      ...(allOptions.length ?
        [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Today*"
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "checkboxes",
                "action_id": "home_todo",
                "options": allOptions,
                ...(completedOptions.length && { "initial_options": completedOptions })
              },
              {
                "type": "button",
                "action_id": "add_task",
                "text": {
                  "type": "plain_text",
                  "text": "Add Task"
                }
              },
            ]
          }] : []
      )
    ]
  };
  // console.log(JSON.stringify(view));
  // return JSON.stringify(view);
  return view;
};