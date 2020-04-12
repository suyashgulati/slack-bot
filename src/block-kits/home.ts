export default (user: string) => {
    let view = {
      "type": "home",
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Hi <@${user}> !*`
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
            "value": "dsr",
            "action_id": "dsr"
          }
        },
        {
          "type": "divider"
        }
      ]
    }
  
    return JSON.stringify(view);
  };