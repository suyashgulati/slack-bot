import { Service } from "typedi";

@Service()
export default class Controller {
    constructor() { }
    async home(data) {
        console.log(data);
    }
}