import {AUTOMATA_LEARNING_SOCKET, RunConfig} from '../run-config';
import {Logger} from '../utils/logger';
import {
  ALPHABET_MESSAGE,
  Command,
  LearnerAlgorithm,
  LearnerConfig,
  Message,
  NOOP_MESSAGE,
  QueryType,
  SESSION_MESSAGE,
  START_MESSAGE,
  STOP_MESSAGE,
  System
} from './model/message';
import {AExecutor} from '../automation/a-executor';
import {MealyExecutor} from '../automation/mealy/mealy-executor';
import {
  generateLoginForm1Commands,
  generateLoginForm2Commands,
  generateResetCommand,
  generateSavingPlanForm2Commands,
  generateSavingPlanFormCommands
} from '../automation/command/commands';
import {ACommand} from '../automation/command/a-command';
import {MooreExecutor} from '../automation/moore/moore-executor';
import {DummyStateMachine} from '../automation/dummy-state-machine';
import {VisualUtils} from "../utils/visual-utils";
import {nextTick} from "../utils/utils";

export class MyWebSocket {
  private static webSocket: WebSocket | undefined;
  public static logger: Logger = new Logger(RunConfig.socketLogging, "WebSocket");
  private static _executor: AExecutor | undefined;

  public static createSocket() {
    if (!RunConfig.socketAutoConnect) {
      return;
    }

    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      return;
    } else if (this.webSocket && this.webSocket.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.logger.log('Connecting socket...');
    // Create WebSocket connection.
    this.webSocket = new WebSocket(AUTOMATA_LEARNING_SOCKET);

    // Connection opened
    this.webSocket.addEventListener("open", () => {
      this.logger.info('WebSocket connected.');
    });

    this.webSocket.addEventListener('close', async () => {
      this.logger.info('WebSocket disconnected.');
      this.logger.log('Socket is closed. Trying to reconnect...');
      this.webSocket = undefined;
      let ticks = RunConfig.SOCKET_RECONNECT_TIMEOUT_SECONDS;
      while (ticks > 0) {
        this.logger.log("..." + ticks);
        await nextTick(1000);
        ticks--;
      }
      this.createSocket();
    });

    this.webSocket.addEventListener("error", () => {
      this.logger.log('Something went wrong...closing webSocket.');
      this.close();
    });

    // Listen for messages
    this.webSocket.addEventListener("message", async (event) => {
      const message: Message = JSON.parse(event.data);
      switch (message.command) {
        case Command.PRE: {
          VisualUtils.updateResetCount(RunConfig.queryType);
          const r = await this._executor?.pre();
          if (r !== undefined) {
            this.sendMessage(r);
          }
          break;
        }
        case Command.STEP: {
          this.logger.log("Received LEARNING message: ", message);
          VisualUtils.updateQueryCount(RunConfig.queryType);

          const response: Message | undefined = await this._executor?.step(message);
          if (this._executor === undefined) console.log("Warning: no executor defined");
          if (response !== undefined) this.sendMessage(response);
          break;
        }
        case Command.POST: {
          const pR = await this._executor?.post();
          if (pR !== undefined) {
            this.sendMessage(pR);
          }
          break;
        }
        case Command.OUTPUT: {
          if (this._executor instanceof MooreExecutor) {
            const oR = await this._executor.currentOutput();
            this.sendMessage(oR);
          } else {
            console.warn("Expected MooreExecutor");
          }
          break;
        }
        case Command.ALPHABET: {
          this.logger.log("Retrieve current alphabet...")
          const alphabet = this.executor?.getCurrentAlphabet() ?? [];
          this.logger.log(alphabet);
          this.sendMessage(ALPHABET_MESSAGE(alphabet));
          break;
        }
        case Command.SESSION: {
          const oldSessionId = RunConfig.sessionId;
          const newSessionId = message.session?.newSessionId;
          RunConfig.sessionId = newSessionId;
          this.sendMessage(SESSION_MESSAGE(oldSessionId, newSessionId));
          break;
        }
        case Command.FINISHED: {
          VisualUtils.modifyRootPointerEvents('auto');
          console.log(message.command + ': ' + message.symbol);
          break;
        }
        case Command.RESTORE: {
          console.log(message.command + ': ' + message.symbol);
          // TODO handle on server side??
          this.sendMessage(await this._executor?.pre() ?? NOOP_MESSAGE());
          break;
        }
        case Command.MESSAGE:
          if (message.queryType) {
            console.log(message.queryType === QueryType.MQ ? 'Asking MQs.' : 'Asking EQs.')
            RunConfig.queryType = message.queryType;
          }
          break;
        default: {
          console.log('Unknown Command: ' + message.command);
          console.log(message);
          break;
        }
      }
    });
  }

  public static close() {
    if (this.webSocket?.readyState === WebSocket.OPEN) {
      this.webSocket?.close();
    }
    this.webSocket = undefined;
  }

  public static setExecutor() {
    const resetCommand = generateResetCommand();
    let commands: ACommand[];
    switch (RunConfig.LEARNING_MODE) {
      case System.HTML_LF:
        commands = generateLoginForm1Commands();
        break;
      case System.DESIGNED_LF:
        commands = generateLoginForm2Commands();
        break;
      case System.SPF1:
        commands = generateSavingPlanFormCommands();
        break;
      case System.SPF2:
        commands = generateSavingPlanForm2Commands();
        break;
      case System.DUMMY:
        this._executor = new DummyStateMachine();
        return;
      default:
        commands = [];
        break;
    }

    switch (RunConfig.LEARNER_ALGORITHM) {
      case LearnerAlgorithm.MEALY:
        this._executor = new MealyExecutor(commands, resetCommand);
        break;
      case LearnerAlgorithm.MOORE:
        this._executor = new MooreExecutor(commands, resetCommand);
        break;
      default:
        break;
    }
  }

  public static start() {
    if (RunConfig.LEARNING_MODE === System.DUMMY && RunConfig.LEARNER_ALGORITHM !== LearnerAlgorithm.MEALY) {
      alert("DummyStateMachine can only be learned with\nMEALY learning algorithm")
      console.warn("DummyStateMachine can only be learned with MEALY learning algorithm");
      return;
    }

    const alphabet = this.executor?.getFullAlphabet() ?? [];
    const config: LearnerConfig = new LearnerConfig(RunConfig.LEARNER_ALGORITHM, RunConfig.LEARNING_MODE);
    const m = START_MESSAGE(alphabet, config);
    console.log("Start Learning " + m?.config?.name + " with alphabet: ", m?.alphabet);
    this.sendMessage(m);
  }

  public static stop() {
    this.sendMessage(STOP_MESSAGE());
  }


  static get executor(): AExecutor | undefined {
    return this._executor;
  }

  private static sendMessage(message: Message) {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      this.logger.log("Sending message ", message);
      this.webSocket.send(JSON.stringify(message));
    } else {
      // alert("Unable to send message. Is WebSocket connected?")
      console.warn("Warning: unable to send message. Is WebSocket connected?");
    }
  }
}