import { map, chain } from 'lodash';
import todoItemBuilder from './builders/todo-item-builder';
import Task from '../shared/interfaces/task';

export default (user: string, tasks: Task[]) => {
  const allOptions = map(tasks, todoItemBuilder);
  const completedOptions = chain(tasks).filter({ isComplete: true }).map(todoItemBuilder).value();
  const elementProps = { 'options': allOptions, 'initial_options': completedOptions };
  let view = {
    "type": "home",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*Hi <@${user}> !*`
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
            "text": {
              "type": "plain_text",
              "text": "Add Item"
            }
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Generate DSR from To-Do list"
            }
          }
        ]
      },
    ]
  };
  // console.log(JSON.stringify(view));
  // return JSON.stringify(view);
  return view;
};