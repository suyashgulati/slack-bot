import { Service } from "typedi";
import { writeFile, readdir, unlink } from "fs";

@Service()
export default class Logger {
    log(payload: any) {
        if (process.env.ENVIRONMENT === 'dev') {
            this.clearLogs();
            const copiedArgs = JSON.parse(JSON.stringify(payload));
            copiedArgs.context.botToken = 'xoxb-***';
            if (copiedArgs.context.userToken) {
                copiedArgs.context.userToken = 'xoxp-***';
            }
            copiedArgs.client = {};
            copiedArgs.logger = {};
            // payload.logger.info(
            //     "Dumping request data for debugging...\n\n" +
            //     JSON.stringify(copiedArgs, null, 2) +
            //     "\n"
            // );
            const path = `logs/${Date.now()}.json`;
            writeFile(path, JSON.stringify(copiedArgs, null, 2), () => console.log('log written @> ', path));
        }
    }

    clearLogs() {
        readdir('logs', (error, files) => {
            if (files.length > 10) {
                files.forEach(file => unlink(`logs/${file}`, () => console.log('logs deleted')))
            }
        });
    }
}
