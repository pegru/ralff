import {Message} from '../socket/model/message';
import {Logger} from '../utils/logger';
import {RELOAD_THRESHOLD, RunConfig} from '../run-config';
import {ACommand} from "./command/a-command";

export abstract class AExecutor {
  protected thresholdMetric: number;
  protected logger: Logger;

  protected knownCommands: ACommand[];
  protected readonly resetCommand: ACommand;

  protected constructor(commandList: ACommand[], resetCommand: ACommand) {
    this.knownCommands = commandList;
    this.resetCommand = resetCommand;

    const queryCount = RunConfig.queryCount.mqCount + RunConfig.queryCount.eqCount;
    this.thresholdMetric = Math.floor(queryCount / RELOAD_THRESHOLD);
    this.logger = new Logger(RunConfig.executorLogging, this.constructor.name);
  }

  getCurrentAlphabet(): string[] {
    return this.knownCommands
      .filter(cmd => cmd.isEnabled())
      .map(cmd => cmd.symbol);
  }

  getFullAlphabet(): string[] {
    return this.knownCommands.map(cmd => cmd.symbol);
  }

  // abstract getFullAlphabet(): string[];

  // abstract getCurrentAlphabet(): string[];

  abstract pre(): Promise<Message | undefined>;

  abstract step(message: Message): Promise<Message | undefined>;

  abstract post(): Promise<Message | undefined>;

}