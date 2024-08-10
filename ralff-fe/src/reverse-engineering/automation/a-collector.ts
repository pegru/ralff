import {Action} from '../utils/action-generator';
import {Logger} from '../utils/logger';
import {RunConfig} from '../run-config';
import {HTML_FORM} from '../utils/control-utils';
import {nextTick} from "../utils/utils";

export abstract class ACollector {
  protected uiSettled = true;
  private uiMutationObserver: MutationObserver;
  protected logger: Logger;
  protected target: Element;
  protected mutationObserver: MutationObserver;


  protected constructor() {
    const form = document.querySelector(HTML_FORM);
    this.target = form ?? document.body;
    this.uiSettled = true;
    this.logger = new Logger(RunConfig.executorLogging, this.constructor.name);
    this.mutationObserver = new MutationObserver((mutations, observer) => this.mutationObserverCB(mutations, observer));
    this.uiMutationObserver = new MutationObserver((mutations, observer) => this.uiObserverCB(mutations, observer));
  }

  private uiObserverCB(mutationList: MutationRecord[], observer: MutationObserver) {
    this.uiSettled = false;
  }

  public async waitForUi() {
    do {
      this.uiSettled = true;
      await nextTick();
      await nextTick();
    } while (!this.uiSettled);
  }

  abstract mutationObserverCB(mutationList: MutationRecord[], observer: MutationObserver): void;

  abstract reset(): void;

  pre(): void {
    this.uiMutationObserver.observe(this.target, {childList: true, subtree: true});
  }

  post(): Promise<Action[]> {
    this.uiMutationObserver.disconnect();
    return Promise.resolve([]);
  }
}