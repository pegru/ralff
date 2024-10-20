import {QueryCount, ROOT_ID, RunConfig} from '../run-config';
import {generateMessagesForAlphabet, generateResetCommand, generateSavingPlanForm2Commands} from '../automation/command/commands';
import {MyWebSocket} from '../socket/my-web-socket';
import {LearnerAlgorithm, QueryType, System} from '../socket/model/message';
import {MealyExecutor} from "../automation/mealy/mealy-executor";

const MQ_QUERY_COUNT_ID = 'mq-query-count';
const MQ_RESET_COUNT_ID = 'mq-reset-count';
const EQ_QUERY_COUNT_ID = 'eq-query-count';
const EQ_RESET_COUNT_ID = 'eq-reset-count';

export class VisualUtils {
  private static visualsRoot: HTMLDivElement | undefined;

  public static createVisuals(): void {
    const rootElement = document.querySelector(ROOT_ID);

    if (rootElement) {
      this.visualsRoot = document.createElement('div');
      this.visualsRoot.id = "visuals-div";
      rootElement.before(this.visualsRoot)
    }

    this.createAutomataLearningButtons();
    if (RunConfig.debugMode) {
      this.createDebugButton();
    }
  }

  public static updateQueryCount(queryType: QueryType | undefined) {
    queryType === undefined && console.log('Could not update any query count');
    const id = queryType === QueryType.EQ ? EQ_QUERY_COUNT_ID : MQ_QUERY_COUNT_ID;
    const number = queryType === QueryType.EQ ? ++RunConfig.queryCount.eqCount : ++RunConfig.queryCount.mqCount;
    const element = document.getElementById(id);
    if (element) {
      element.innerText = number.toString();
    }
  }

  public static updateResetCount(queryType: QueryType) {
    queryType === undefined && console.log('Could not update any reset count');
    const id = queryType === QueryType.EQ ? EQ_RESET_COUNT_ID : MQ_RESET_COUNT_ID;
    const number = queryType === QueryType.EQ ? ++RunConfig.queryCount.eqReset : ++RunConfig.queryCount.mqReset;
    const element = document.getElementById(id);
    if (element) {
      element.innerText = number.toString();
    }
  }

  public static resetCounter() {
    RunConfig.queryCount = new QueryCount();
    [MQ_QUERY_COUNT_ID, MQ_RESET_COUNT_ID, EQ_QUERY_COUNT_ID, EQ_RESET_COUNT_ID].forEach(e => {
      const element = document.getElementById(e);
      if (element) {
        element.innerText = Number(0).toString();
      }
    })
  }

  private static createAutomataLearningButtons() {
    const div = document.createElement('div');
    div.style.display = "flex";
    div.style.gap = "10px"
    div.style.padding = "10px"
    div.style.alignItems = 'flex-start';
    div.appendChild(this.createConnectButton());
    const divCommands = document.createElement('div')
    divCommands.textContent = "Σ:";
    div.appendChild(divCommands);
    div.appendChild(this.createModeSelector());
    const fstDiv = document.createElement('div')
    fstDiv.textContent = "FST:";
    div.appendChild(fstDiv);
    div.appendChild(this.createAlgorithmSelector());
    div.appendChild(this.createStartButton());
    div.appendChild(this.createStopButton());
    div.appendChild(this.createResetButton());
    div.appendChild(this.createQueryCounter());
    this.visualsRoot?.appendChild(div);
  }

  private static createConnectButton() {
    const socketButton = document.createElement('button');
    socketButton.textContent = RunConfig.socketAutoConnect ? 'Disconnect' : 'Connect';
    socketButton.addEventListener('click', async () => {
      RunConfig.socketAutoConnect = !RunConfig.socketAutoConnect;
      if (RunConfig.socketAutoConnect) {
        MyWebSocket.createSocket();
      } else {
        MyWebSocket.close();
      }
      socketButton.textContent = RunConfig.socketAutoConnect ? 'Disconnect' : 'Connect';
    });
    return socketButton;
  }

  private static createStartButton() {
    const socketButton = document.createElement('button');
    socketButton.textContent = 'Start';
    socketButton.addEventListener('click', async () => {
      this.resetCounter();
      MyWebSocket.setExecutor();
      MyWebSocket.start();
    });
    return socketButton;
  }

  private static createModeSelector() {
    const select = document.createElement('select');
    select.id = "learning-mode";
    select.addEventListener('change', ev => {
      const optionElement = ev.target as HTMLOptionElement;
      RunConfig.LEARNING_MODE = optionElement.value as System;
      MyWebSocket.setExecutor();
    });

    const keys = Object.keys(System);
    keys.forEach(s => {
      const option = document.createElement('option');
      option.value = s;
      option.innerText = s;
      select.appendChild(option);
    });

    select.value = RunConfig.LEARNING_MODE;
    return select;
  }

  private static createAlgorithmSelector() {
    const select = document.createElement('select');
    select.id = "select-algorithm";
    select.addEventListener('change', ev => {
      const optionElement = ev.target as HTMLOptionElement;
      RunConfig.LEARNER_ALGORITHM = optionElement.value as LearnerAlgorithm;
      MyWebSocket.setExecutor();
    });

    const keys = Object.keys(LearnerAlgorithm);
    keys.forEach(s => {
      const option = document.createElement('option');
      option.value = s;
      option.innerText = s;
      select.appendChild(option);
    });

    select.value = RunConfig.LEARNER_ALGORITHM;
    return select;
  }

  private static createStopButton() {
    const socketButton = document.createElement('button');
    socketButton.textContent = 'Stop';
    socketButton.addEventListener('click', async () => {
      MyWebSocket.stop();
    });
    return socketButton;
  }

  private static createCounter(text: string, id: string, initialValue: number) {
    const container = document.createElement('div');
    container.style.display = "flex";
    const label = document.createElement('div');
    label.innerText = text;
    const counter = document.createElement("div");
    counter.id = id;
    counter.innerText = String(initialValue);
    counter.style.paddingLeft = "10px"
    counter.style.paddingRight = "10px";
    container.appendChild(label);
    container.appendChild(counter);
    return container;
  }

  private static createQueryCounter() {
    const queryContainer = document.createElement('div');
    queryContainer.style.display = "flex";
    queryContainer.style.flexDirection = "column";
    queryContainer.style.paddingLeft = "50px";

    const mqCounter = document.createElement('div');
    mqCounter.style.display = 'flex';
    mqCounter.appendChild(this.createCounter('MQ:', MQ_QUERY_COUNT_ID, RunConfig.queryCount.mqCount));
    mqCounter.appendChild(this.createCounter('MQ reset:', MQ_RESET_COUNT_ID, RunConfig.queryCount.mqReset));

    const eqCounter = document.createElement('div');
    eqCounter.style.display = 'flex';
    eqCounter.appendChild(this.createCounter('EQ:', EQ_QUERY_COUNT_ID, RunConfig.queryCount.eqCount));
    eqCounter.appendChild(this.createCounter('EQ reset:', EQ_RESET_COUNT_ID, RunConfig.queryCount.eqReset));

    queryContainer.appendChild(mqCounter);
    queryContainer.appendChild(eqCounter);

    return queryContainer;
  }

  private static createResetButton() {
    const container = document.createElement('div');
    container.style.display = "flex";
    container.style.paddingLeft = "20px"
    const cookieButton = document.createElement('button');
    cookieButton.textContent = 'Reset';
    cookieButton.addEventListener('click', async () => {
      RunConfig.reset();
      window.location.reload();
    });
    container.appendChild(cookieButton);
    return container;
  }


  private static createDebugButton() {
    const container = document.createElement('div');
    container.style.display = "flex";

    const button = document.createElement('button');
    button.textContent = "Test command";
    button.addEventListener('click', async () => {
      // execute commands
      const commandList = generateSavingPlanForm2Commands()
      const messages = generateMessagesForAlphabet(["cG", "iSD", "iSD", "RESET"], [...commandList, generateResetCommand()]);
      const executor = new MealyExecutor(commandList, generateResetCommand());
      await executor.pre();
      for (const m of messages) {
        console.log(m.symbol);
        const res = await executor.step(m);
        console.log(res?.symbol, res?.outputs);
      }
      // console.log((await executor.currentOutput()).outputs);
      // console.log((await executor.currentOutput()).outputs);
      const res = await executor.post();
      console.log(res);

    });

    container.appendChild(button);
    this.visualsRoot?.appendChild(container);
  }
}

