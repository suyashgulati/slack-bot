import UserTodo from "../db/entity/user-todo";
import { map } from "lodash";

export default (userId: string, todos: UserTodo[]) => ({
    "callback_id": "dsr_modal",
    "type": "modal",
    "title": {
        "type": "plain_text",
        "text": "Daily Status Report",
        "emoji": true
    },
    "submit": {
        "type": "plain_text",
        "text": "Submit",
        "emoji": true
    },
    "close": {
        "type": "plain_text",
        "text": "Cancel",
        "emoji": true
    },
    "blocks": [{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `Hey <@${userId}>!\n\n`
        }
    },
    {
        "type": "divider"
    },
    {
        "block_id": "dsr_1_block",
        "type": "input",
        "label": {
            "type": "plain_text",
            "text": "What did you do today?",
            "emoji": true
        },
        "element": {
            "action_id": "dsr_1_input",
            "type": "plain_text_input",
            "multiline": true,
            "placeholder": {
                "type": "plain_text",
                "text": "Enter your tasks separated by new lines like:\nTask 1\nTask 2\nTask 3..."
            },
            ...(todos?.length && {
                "initial_value": map(todos, t => `${t.text}${t.isComplete ? ' - Done' : ''}`).join("\n")
            })
        }
    },
    {
        "block_id": "dsr_2_block",
        "type": "input",
        "label": {
            "type": "plain_text",
            "text": "What problems are you encountering?",
            "emoji": true
        },
        "element": {
            "action_id": "dsr_2_input",
            "type": "plain_text_input",
            "multiline": true,
            "placeholder": {
                "type": "plain_text",
                "text": "Enter your challenges separated by new lines like:\nChallenge 1\nChallenge 2\nChallenge 3..."
            }
        },
        "optional": true
    },
    {
        "block_id": "dsr_3_block",
        "type": "input",
        "label": {
            "type": "plain_text",
            "text": "What are you planning to do tomorrow?",
            "emoji": true
        },
        "element": {
            "action_id": "dsr_3_input",
            "type": "plain_text_input",
            "multiline": true,
            "placeholder": {
                "type": "plain_text",
                "text": "Enter your tasks separated by new lines like:\nTask 1\nTask 2\nTask 3..."
            }
        },
    }
    ]
})