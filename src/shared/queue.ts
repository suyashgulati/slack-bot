import Queue, { Job } from 'bull';
import { setQueues } from 'bull-board';
import { Service } from 'typedi';
import IMailOptions from './interfaces/mail-options';
import MailService from './mailer/mail';
import { IType } from './enums/type';
import { DailyEntryRepository } from '../db/repository/daily-entry-repository';
import SlackFactory from '../slack-app';
import { MailOptionsInvalidError } from './errors/mail-errors';

@Service()
export class QueueService {
  private mailQueue: Queue.Queue<IMailOptions>
  constructor(
    private mailService: MailService,
    private dailEntryRepo: DailyEntryRepository,
    private slackFactory: SlackFactory,
  ) {
    this.mailQueue = new Queue<IMailOptions>('mail', {
      redis: {
        port: +process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        // password: 
      }
    });
    setQueues([this.mailQueue]);
    this.mailQueue.process((job: Job<IMailOptions>) => this.mailProcess(job));
  }

  async mailProcess(job: Job<IMailOptions>) {
    const data = job.data;
    try {
      const mailResult = await this.mailService.sendMail(data);
      if (data.type == IType.WFH) {
        this.dailEntryRepo.saveMessageId(data.userId, data.date, mailResult.messageId);
      }
    } catch (e) {
      console.log(e);
      if (e instanceof MailOptionsInvalidError) {
        this.slackFactory.sendErrorMessage(data.userId, 'Mail not sent :warning:\nPlease configure your to/cc in settings panel :gear:'); // TODO:Magic
        job.moveToFailed(e, true);
      } else {
        this.slackFactory.sendErrorMessage(data.userId, 'Mail not sent :warning\nServer Issue! Please Report to HR!'); // TODO:Magic
      }
    }
  }

  addMailJob(mailOptions: IMailOptions) {
    this.mailQueue.add(mailOptions); //TODO: add attempts {attempts:3}
  }

}
