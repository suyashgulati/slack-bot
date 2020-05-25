const list = (item: string) => `<li>${item}</li>`;

export default (tasks: string[]) => `
    <b>Task Plan:</b>
    <ul>${tasks.map(list).join('')}</ul>
`;