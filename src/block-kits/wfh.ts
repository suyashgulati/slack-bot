export default () => ([
	{
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
			"text": "Whats your task plan for today?",
			"emoji": true
		},
		"element": {
			"type": "plain_text_input",
			"multiline": true
		}
	}
])