import User from "../../db/entity/user";

export default (user: User) => ({
    "text": {
        "type": "plain_text",
        "text": `${user.name}`,
        "emoji": false,
    },
    "value": `${user.id}`
});