export default (userId: string) => ([
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `Hey <@${userId}> :wave:`
        }
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Its time to add today's DSR\nSimply click the button below:"
        }
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "action_id": "dsr",
                "text": {
                    "type": "plain_text",
                    "text": "Add DSR",
                    "emoji": true
                }
            },
            // {
            //     "type": "static_select",
            //     "placeholder": {
            //         "type": "plain_text",
            //         "text": "Delay",
            //         "emoji": true
            //     },
            //     "options": [{
            //         "text": {
            //             "type": "plain_text",
            //             "text": "*this is plain_text text*"
            //         },
            //         "value": "value-0"
            //     },
            //     {
            //         "text": {
            //             "type": "plain_text",
            //             "text": "*this is plain_text text*"
            //         },
            //         "value": "value-1"
            //     },
            //     {
            //         "text": {
            //             "type": "plain_text",
            //             "text": "*this is plain_text text*"
            //         },
            //         "value": "value-2"
            //     }]
            // }
        ]
    }
])