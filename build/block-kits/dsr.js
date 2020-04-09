"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () { return ({
    "callback_id": "dsr-view",
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
                "text": "Hey David!\n\n"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "input",
            "label": {
                "type": "plain_text",
                "text": "What did you do today?",
                "emoji": true
            },
            "element": {
                "type": "plain_text_input",
                "multiline": true
            }
        },
        {
            "type": "input",
            "label": {
                "type": "plain_text",
                "text": "What problems are you encountering?",
                "emoji": true
            },
            "element": {
                "type": "plain_text_input",
                "multiline": true
            },
            "optional": true
        },
        {
            "type": "input",
            "element": {
                "type": "plain_text_input",
                "multiline": true
            },
            "label": {
                "type": "plain_text",
                "text": "What are you planning to do tomorrow?",
                "emoji": true
            }
        }
    ]
}); });
//# sourceMappingURL=dsr.js.map