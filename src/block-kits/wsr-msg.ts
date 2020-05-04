export default (userId: string, downloadUrl: string) => ([
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
            "text": "Requested WSR is ready"
        },
        "accessory": {
            "type": "button",
            "action_id": "download_wsr",
            "style": "primary",
            "url": downloadUrl,
            "text": {
                "type": "plain_text",
                "text": "Download",
                "emoji": true
            },
        },
    },
])