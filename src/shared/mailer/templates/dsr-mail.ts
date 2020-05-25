import _ from "lodash";

const list = (item: string) => `<li>${item}</li>`;

export default (today: string[], challenges: string[], tomorrow: string[]) => `
    <b>EOD Status:</b>
    ${_.isEmpty(today) ? 'No Task today!' : `<ul>${today.map(list).join('')}</ul>`}
    
    <b>Challenges:<b>
    ${_.isEmpty(challenges) ? '<p>None!</p>' : `<ul>${challenges.map(list).join('')}</ul>`}

    <b>Tomorrow:<b>
    ${_.isEmpty(tomorrow) ? '<p>Not Planned Yet!</p>' : `<ul>${tomorrow.map(list).join('')}</ul>`}
`;