export default () => ({
    "callback_id": "add_task_modal",
    "type": "modal",
    "title": {
        "type": "plain_text",
        "text": "Add Task",
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
    "blocks": [
        {
            "block_id": "add_task_block",
            "type": "input",
            "element": {
                "action_id": "add_task_input",
                "type": "plain_text_input"
            },
            "label": {
                "type": "plain_text",
                "text": "Add Task",
                "emoji": true
            }
        }
    ]
})