export default () => ({
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "Settings",
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
				"text": "Pick a time you want notification for WFH"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 1",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 2",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 3",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"initial_option": {
					"text": {
						"type": "plain_text",
						"text": "Choice 2",
						"emoji": true
					},
					"value": "value-1"
				}
			}
		},
        {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Pick a time you want notification for DSR"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 1",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 2",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 3",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"initial_option": {
					"text": {
						"type": "plain_text",
						"text": "Choice 2",
						"emoji": true
					},
					"value": "value-1"
				}
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Pick an item from the dropdown list"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 1",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 2",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 3",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"initial_option": {
					"text": {
						"type": "plain_text",
						"text": "Choice 2",
						"emoji": true
					},
					"value": "value-1"
				}
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Pick one or more people you would like to add in cc!"
			},
			"accessory": {
				"type": "multi_static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select :e-mail:",
					"emoji": true
				},
				"action_id": "cc_multi_select",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 1",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 2",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 3",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"initial_options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 3",
							"emoji": true
						},
						"value": "value-2"
					}
				]
			}
		}
	]
})