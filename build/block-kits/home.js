"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (user) {
    var view = {
        "type": "home",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Hi <" + user + "|@user>!*"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": ":calendar:   *Add Daily Status Report*"
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Add DSR",
                        "emoji": true
                    },
                    "style": "primary",
                    "value": "dsr-modal",
                    "action_id": "dsr-modal"
                }
            },
            {
                "type": "divider"
            }
        ]
    };
    return JSON.stringify(view);
});
//# sourceMappingURL=home.js.map