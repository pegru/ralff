import {Action} from '../../utils/action-generator';
import {SessionCtx} from './session-ctx';
import {RunConfig} from "../../run-config.ts";

export enum System {
  DUMMY = "DUMMY",
  HTML_LF = "HTML_LF",
  DESIGNED_LF = "DESIGNED_LF",
  SPF1 = "SPF1",
  SPF2 = "SPF2"
}

export enum QueryType {
  MQ = "MQ",
  EQ = "EQ"
}

export enum LearnerAlgorithm {
  MOORE = "MOORE",
  MEALY = "MEALY"
}

export enum Command {
  FINISHED = "FINISHED",
  START = "START",
  STOP = "STOP",
  PRE = "PRE",
  STEP = "STEP",
  POST = "POST",
  RESTORE = "RESTORE",
  SESSION = 'SESSION',
  ALPHABET = "ALPHABET",
  OUTPUT = "OUTPUT",
  MESSAGE = "MESSAGE"
}

type DotRankDir = 'TB' | 'LR';

export class EQMealyConfig {
  randomWalkChanceOfResetting: number;
  randomWalkNumberOfSymbols: number;

  constructor(randomWalkChanceOfResetting: number, randomWalkNumberOfSymbols: number) {
    this.randomWalkChanceOfResetting = randomWalkChanceOfResetting;
    this.randomWalkNumberOfSymbols = randomWalkNumberOfSymbols;
  }
}

export class EQMooreConfig {
  randomWordsMinLength: number;
  randomWordsMaxLength: number;
  randomWordsMaxTests: number;

  constructor(randomWordsMinLength: number, randomWordsMaxLength: number, randomWordsMaxTests: number) {
    this.randomWordsMinLength = randomWordsMinLength;
    this.randomWordsMaxLength = randomWordsMaxLength;
    this.randomWordsMaxTests = randomWordsMaxTests;
  }
}

type EQConfig = EQMealyConfig | EQMooreConfig;

export class LearnerConfig {
  readonly algorithm: LearnerAlgorithm;
  readonly name: string;
  readonly rankdir: DotRankDir;
  readonly eqconfig: EQConfig | undefined;
  readonly saveAllHypotheses: boolean;

  constructor(algorithm: LearnerAlgorithm, mode: System, rankDir: DotRankDir = 'TB') {
    this.algorithm = algorithm;
    this.rankdir = rankDir;
    this.name = 'system';
    this.saveAllHypotheses = RunConfig.saveAllHypotheses;

    switch (this.algorithm) {
      case LearnerAlgorithm.MOORE:
        this.eqconfig = new EQMooreConfig(RunConfig.eqConfig.randomWordsMinLength,
          RunConfig.eqConfig.randomWordsMaxLength,
          RunConfig.eqConfig.randomWordsMaxTests);
        break;
      case LearnerAlgorithm.MEALY:
        this.eqconfig = new EQMealyConfig(RunConfig.eqConfig.randomWalkChanceOfResetting,
          RunConfig.eqConfig.randomWalkNumberOfSymbols);
        break;
      default:
        this.eqconfig = undefined;
    }

    switch (mode) {
      case System.HTML_LF:
        this.name = 'lf-html';
        break;
      case System.DESIGNED_LF:
        this.name = 'lf-designed';
        break;
      case System.SPF1:
        this.name = 'spf-v1';
        this.rankdir = 'LR';
        break;
      case System.SPF2:
        this.name = 'spf-v2';
        this.rankdir = 'LR';
        break;
      case System.DUMMY:
        this.name = 'dummy';
        this.rankdir = 'LR'
        break;
    }
  }
}

export class MessageBuilder {
  private readonly _command: Command;

  constructor(command: Command) {
    this._command = command;
  }

  private _alphabet: string[] | undefined;

  get alphabet(): string[] | undefined {
    return this._alphabet;
  }

  private _symbol: string | undefined;

  get symbol(): string | undefined {
    return this._symbol;
  }

  private _outputs: Action[] | undefined;

  get outputs(): Action[] | undefined {
    return this._outputs;
  }

  private _session: SessionCtx | undefined;

  get session(): SessionCtx | undefined {
    return this._session;
  }

  private _config: LearnerConfig | undefined;

  get config(): LearnerConfig | undefined {
    return this._config;
  }

  get command(): Command {
    return this._command;
  }

  withAlphabet(alphabet: string[]): MessageBuilder {
    this._alphabet = alphabet;
    return this;
  }

  withSymbol(symbol: string): MessageBuilder {
    this._symbol = symbol;
    return this;
  }

  withOutputs(outputs: Action[]): MessageBuilder {
    this._outputs = outputs;
    return this;
  }

  withSessionCtx(sessionCtx: SessionCtx): MessageBuilder {
    this._session = sessionCtx;
    return this;
  }

  withLearnerConfig(learnerConfig: LearnerConfig): MessageBuilder {
    this._config = learnerConfig;
    return this;
  }

  toMessage() {
    return new Message(this);
  }
}

export class Message {
  public command: Command;
  public alphabet: string[] | undefined;
  public symbol: string | undefined;
  public queryType: QueryType | undefined;
  public outputs: Action[] | undefined;
  public session: SessionCtx | undefined;
  public config: LearnerConfig | undefined;


  constructor(builder: MessageBuilder) {
    this.command = builder.command;
    this.alphabet = builder.alphabet;
    this.symbol = builder.symbol;
    this.outputs = builder.outputs;
    this.session = builder.session;
    this.config = builder.config;
    this.queryType = undefined;
  }
}

export const START_MESSAGE = (alphabet: string[], config: LearnerConfig): Message => new MessageBuilder(Command.START).withAlphabet(alphabet).withLearnerConfig(config).toMessage();
export const STOP_MESSAGE = (): Message => new MessageBuilder(Command.STOP).toMessage();
export const STEP_MESSAGE = (outputs: Action[] = []): Message => new MessageBuilder(Command.STEP).withOutputs(outputs).toMessage();
export const STEP_SINK_MESSAGE = (): Message => new MessageBuilder(Command.STEP).withSymbol("sink").toMessage();
export const RES_STEP_MESSAGE = (symbol: string): Message => new MessageBuilder(Command.STEP).withSymbol(symbol).toMessage();
export const NOOP_MESSAGE = (): Message => new MessageBuilder(Command.STEP).withSymbol("NOOP").toMessage();
export const PRE_MESSAGE = (): Message => new MessageBuilder(Command.PRE).toMessage();
export const POST_MESSAGE = (): Message => new MessageBuilder(Command.POST).toMessage();

export const ALPHABET_MESSAGE = (alphabet: string[]): Message => new MessageBuilder(Command.ALPHABET).withAlphabet(alphabet).toMessage();
export const OUTPUT_MESSAGE = (outputs: Action[]): Message => new MessageBuilder(Command.OUTPUT).withOutputs(outputs).toMessage();
export const SESSION_MESSAGE = (oldSessionId: string | undefined, newSessionId: string | undefined): Message => new MessageBuilder(Command.SESSION).withSessionCtx(new SessionCtx(oldSessionId, newSessionId)).toMessage();