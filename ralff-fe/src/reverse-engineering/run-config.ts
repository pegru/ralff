import {LearnerAlgorithm, QueryType, System} from './socket/model/message';
import {getCookie, setCookie} from './utils/cookie-handler';

export const ROOT_ID = '#root';
export const AUTOMATA_LEARNING_SOCKET = import.meta.env.VITE_RALFF_BE_WS ?? 'ws://localhost:8080/ralff_be_war/websocket'
export const RELOAD_THRESHOLD = 2000;
export const SESSION_ID_COOKIE: string = "sessionId";
export const SOCKET_AUTO_CONNECT_COOKIE: string = "shouldConnectSocket";
export const LEARNING_MODE_COOKIE: string = 'learningMode';
export const LEARNING_ALGORITHM_COOKIE: string = 'learningAlgorithm';
export const QUERY_TYPE_COOKIE: string = 'queryType';
export const MQ_COUNT_COOKIE: string = 'mqQueryCount';
export const EQ_COUNT_COOKIE: string = 'eqQueryCount';
export const MQ_RESET_COUNT_COOKIE: string = 'mqResetCount';
export const EQ_RESET_COUNT_COOKIE: string = 'eqResetCount';

export class QueryCount {
  public mqCount: number = 0;
  public mqReset: number = 0;
  public eqCount: number = 0;
  public eqReset: number = 0;
}

export class DefaultConfig {
  public static socketAutoConnect: boolean = false;
  public static sessionId: string | undefined = undefined;
  public static queryType: QueryType.MQ;
  public static queryCount: QueryCount = new QueryCount()
  public static LEARNING_MODE: System = System.HTML_LF;
  public static LEARNER_ALGORITHM: LearnerAlgorithm = LearnerAlgorithm.MOORE;
}

export class RunConfig {
  public static debugMode: boolean = false;

  // socket
  public static SOCKET_RECONNECT_TIMEOUT_SECONDS = 1;

  public static socketLogging = false;
  public static executorLogging = false;

  // automation depending variables
  public static socketAutoConnect: boolean = DefaultConfig.socketAutoConnect;
  public static sessionId: string | undefined = DefaultConfig.sessionId;
  public static queryType: QueryType = DefaultConfig.queryType;
  public static queryCount: QueryCount = DefaultConfig.queryCount;
  public static LEARNING_MODE: System = DefaultConfig.LEARNING_MODE;
  public static LEARNER_ALGORITHM: LearnerAlgorithm = DefaultConfig.LEARNER_ALGORITHM;


  public static loadRunConfig() {
    this.sessionId = getCookie(SESSION_ID_COOKIE);
    this.LEARNING_MODE = getCookie(LEARNING_MODE_COOKIE) as System ?? this.LEARNING_MODE;
    this.LEARNER_ALGORITHM = getCookie(LEARNING_ALGORITHM_COOKIE) as LearnerAlgorithm ?? this.LEARNER_ALGORITHM;
    this.socketAutoConnect = getCookie(SOCKET_AUTO_CONNECT_COOKIE) === 'true';

    this.queryType = getCookie(QUERY_TYPE_COOKIE) === QueryType.EQ ? QueryType.EQ : QueryType.MQ;
    const mqQueryCount = Number(getCookie(MQ_COUNT_COOKIE));
    this.queryCount.mqCount = Number.isNaN(mqQueryCount) ? this.queryCount.mqCount : mqQueryCount;
    const mqResetCount = Number(getCookie(MQ_RESET_COUNT_COOKIE));
    this.queryCount.mqReset = Number.isNaN(mqResetCount) ? this.queryCount.mqReset : mqResetCount;

    const eqQueryCount = Number(getCookie(EQ_COUNT_COOKIE));
    this.queryCount.eqCount = Number.isNaN(eqQueryCount) ? this.queryCount.mqCount : eqQueryCount;
    const eqResetCount = Number(getCookie(EQ_RESET_COUNT_COOKIE));
    this.queryCount.eqReset = Number.isNaN(eqResetCount) ? this.queryCount.mqReset : eqResetCount;
  }

  public static saveRunConfig() {
    setCookie(SESSION_ID_COOKIE, this.sessionId);
    setCookie(LEARNING_MODE_COOKIE, this.LEARNING_MODE);
    setCookie(LEARNING_ALGORITHM_COOKIE, this.LEARNER_ALGORITHM);
    setCookie(SOCKET_AUTO_CONNECT_COOKIE, String(this.socketAutoConnect));

    setCookie(QUERY_TYPE_COOKIE, String(this.queryType));
    setCookie(MQ_COUNT_COOKIE, String(this.queryCount.mqCount));
    setCookie(MQ_RESET_COUNT_COOKIE, String(this.queryCount.mqReset));

    setCookie(EQ_COUNT_COOKIE, String(this.queryCount.eqCount));
    setCookie(EQ_RESET_COUNT_COOKIE, String(this.queryCount.eqReset));
  }

  public static reset() {
    this.sessionId = DefaultConfig.sessionId;
    this.LEARNING_MODE = DefaultConfig.LEARNING_MODE;
    this.LEARNER_ALGORITHM = DefaultConfig.LEARNER_ALGORITHM;
    // this.socketAutoConnect = DefaultConfig.socketAutoConnect;
    this.queryType = DefaultConfig.queryType;
    this.queryCount = new QueryCount();
  }
}