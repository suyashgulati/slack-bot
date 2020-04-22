export default (user) => ({
	"callback_id": "wfh_modal",
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "Work From Home",
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
			"type": "input",
			"block_id": "wfh_block",
			"label": {
				"type": "plain_text",
				"text": "What's your task plan for today?",
				"emoji": true
			},
			"element": {
				"action_id": "wfh_input",
				"type": "plain_text_input",
				"multiline": true,
				"placeholder": {
					"type": "plain_text",
					"text": "Enter your tasks separated by new lines like:\nTask 1\nTask 2\nTask 3..."
				}
			}
		}
	]
})

// let view2 = {
//     "type": "modal",
//     "title": {
//       "type": "plain_text",
//       "text": "My App",
//       "emoji": true
//     },
//     "submit": {
//       "type": "plain_text",
//       "text": "Submit",
//       "emoji": true
//     },
//     "close": {
//       "type": "plain_text",
//       "text": "Cancel",
//       "emoji": true
//     },
//     "blocks": [
//       {
//         "type": "input",
//         "element": {
//           "type": "plain_text_input"
//         },
//         "label": {
//           "type": "plain_text",
//           "text": "Label",
//           "emoji": true
//         }
//       },
//       {
//         "type": "input",
//         "element": {
//           "type": "plain_text_input"
//         },
//         "label": {
//           "type": "plain_text",
//           "text": "Label",
//           "emoji": true
//         }
//       },
//       {
//         "type": "section",
//         "text": {
//           "type": "mrkdwn",
//           "text": "You can add a more tasks by clicking =>"
//         },
//         "accessory": {
//           "type": "button",
//           "text": {
//             "type": "plain_text",
//             "text": "Button",
//             "emoji": true
//           },
//           "value": "click_me_123"
//         }
//       }
//     ]
//   }