import {Message, NOOP_MESSAGE, POST_MESSAGE, PRE_MESSAGE, RES_STEP_MESSAGE} from '../socket/model/message';
import {AExecutor} from './a-executor';
import {DummyCommand, ResetCommand} from "./command/a-command";

enum SULState {
  s0,
  s1
}

/**
 * Basic dummy State Machine.
 * Example taken from <a href="https://gitlab.science.ru.nl/ramonjanssen/basic-learning">https://gitlab.science.ru.nl/ramonjanssen/basic-learning</a>; last accessed 29.01.2024
 *
 **/
export class DummyStateMachine extends AExecutor {
  private currentState: SULState;

  constructor() {
    const dummyCommands = [];
    dummyCommands.push(new DummyCommand('a'));
    dummyCommands.push(new DummyCommand('b'));

    super(dummyCommands, new ResetCommand());
    this.currentState = SULState.s0;
  }

  async step(message: Message): Promise<Message | undefined> {
    switch (this.currentState) {
      case SULState.s0:
        switch (message.symbol) {
          case "a":
            return RES_STEP_MESSAGE("a");
          case "b":
            this.currentState = SULState.s1;
            return RES_STEP_MESSAGE("b");
        }
        break;
      case SULState.s1:
        switch (message.symbol) {
          case "a":
            return RES_STEP_MESSAGE("b");
          case "b":
            this.currentState = SULState.s0;
            return RES_STEP_MESSAGE("a");
        }
        break;
    }
    return NOOP_MESSAGE();
  }

  post(): Promise<Message | undefined> {
    return Promise.resolve(POST_MESSAGE());
  }

  async pre(): Promise<Message | undefined> {
    this.currentState = SULState.s0;
    return PRE_MESSAGE();
  }
}