import { times, floor, padStart } from 'lodash';

// 48 for every half hour
export const TIME_OPTIONS = times(48, (idx) => ({
    "text": {
        "type": "plain_text",
        "text": padStart(`${floor(idx / 2)}`, 2, '0') + `:` + padStart(`${(idx % 2) * 30}`, 2, '0') + ` Hrs`,
        "emoji": true
    },
    "value": `${(idx / 2).toFixed(1)}`
}));