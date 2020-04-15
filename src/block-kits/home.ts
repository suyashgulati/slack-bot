export default (user: string) => {
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
            "initial_options": [
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "~*Get into the garden :house_with_garden:*~"
                },
                "value": "option 1"
              }
            ],
            "options": [
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "~*Get into the garden :house_with_garden:*~"
                },
                "value": "option 1"
              },
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "*Get the groundskeeper wet :sweat_drops:*"
                },
                "value": "option 2"
              },
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "*Steal the groundskeeper's keys :old_key:*"
                },
                "value": "option 3"
              },
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "*Make the groundskeeper wear his sun hat :male-farmer:*"
                },
                "value": "option 4"
              },
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "*Rake in the lake :ocean:*"
                },
                "value": "option 5"
              },
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "*Have a picnic :knife_fork_plate:*"
                },
                "value": "option 6",
                "description": {
                  "type": "mrkdwn",
                  "text": "Bring to the picnic: sandwich, apple, pumpkin, carrot, basket"
                }
              }
            ]
          },
        ]
      },
      {
        "type": "actions",
        "elements": [
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
      }
    ]
  };

  return JSON.stringify(view);
};