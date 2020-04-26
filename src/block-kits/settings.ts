import { find } from 'lodash';
import User from '../db/entity/user';
import { Time } from '../shared/enums/time';
import { TIME_OPTIONS } from '../shared/constants/time-options';

export default (wfhTime: Time, dsrTime: Time, toUserId: User, ccUserIds: User[]) => ({
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "Settings",
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
				"action_id": "wfh_time",
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": TIME_OPTIONS,
				"initial_option": find(TIME_OPTIONS, to => to.value === wfhTime.toString())
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Pick a time you want notification for DSR"
			},
			"accessory": {
				"action_id": "dsr_time",
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": TIME_OPTIONS,
				"initial_option": find(TIME_OPTIONS, to => to.value === dsrTime)
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Pick an item from the dropdown list"
			},
			"accessory": {
				"type": "users_select",
				"action_id": "user_to",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Pick one or more people you would like to add in cc!"
			},
			"accessory": {
				"type": "multi_users_select",
				"action_id": "user_cc",
				"placeholder": {
					"type": "plain_text",
					"text": "Select :e-mail:",
					"emoji": true
				},
			}
		}
	]
});

const userOptionFactory = (user: User) => ({
	"text": {
		"type": "plain_text",
		"text": user.name,
		"emoji": false
	},
	"value": user.id
});
