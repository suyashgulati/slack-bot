import { Service } from "typedi";
import { promises as fs, readdir, unlink } from "fs";
import { v4 as uuid } from 'uuid';
import DailyEntry from "../db/entity/daily-entry";
import _ from "lodash";

@Service()
export default class FSService {
    async saveAsCSV(string: string): Promise<string> {
        this.clearFiles();
        const path = `/files/${uuid()}`;
        await fs.writeFile(`.${path}`, string, 'utf8');
        return path;
    }

    async generateWSR(dsrs: DailyEntry[]) {
        const dsrGrouped = _.groupBy(dsrs, dsr => dsr.user.name);
        let stringForCSV = '';
        _.map(dsrGrouped, (val, key) => {
            stringForCSV += `"${key}","${_.map(val, dsr => dsr.today)}"\n`
        });
        console.log(stringForCSV);
        return this.saveAsCSV(stringForCSV);
    }

    clearFiles() {
        readdir('logs', (error, files) => {
            if (files.length > +process.env.MAX_FILE_COUNT) {
                files.forEach(file => unlink(`logs/${file}`, () => console.log('logs deleted')))
            }
        });
    }
}
