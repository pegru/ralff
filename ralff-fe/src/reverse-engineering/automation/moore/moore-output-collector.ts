import {ACollector} from '../a-collector';
import {Action, ActionProperty} from '../../utils/action-generator';
import {extractCustomId, extractString, setCustomId} from '../../utils/control-utils';

export class MooreOutputCollector extends ACollector {

  private elementRegistry: Set<string>;

  private readonly observerConfig: MutationObserverInit = {
    attributes: false,
    attributeFilter: undefined,
    childList: true,
    subtree: true
  };

  constructor() {
    super();
    this.elementRegistry = new Set<string>();
  }

  mutationObserverCB(mutationList: MutationRecord[], _: MutationObserver): void {
    this.uiSettled = false;
    mutationList.forEach(record => {
      if (record.type === 'childList') {
        // addedNodes
        record.addedNodes.forEach(n => {
          const id = setCustomId(n);
          id && this.elementRegistry.add(id);
        });

        // removedNodes
        record.removedNodes.forEach(n => {
          const id = extractCustomId(n);
          id && this.elementRegistry.delete(id);
        });
      }
    });
  }

  pre(): void {
    super.pre();
    this.elementRegistry.clear();
    this.mutationObserver.observe(this.target, this.observerConfig);
  }

  reset(): void {
    this.elementRegistry.clear();
  }

  async currentOutputs(): Promise<Action[]> {
    await this.waitForUi();
    const actions: Action[] = [];
    this.elementRegistry.forEach(id => {
      const element = document.querySelector(`[custom-id=${id}]`);
      if (element) {
        actions.push(Action.custom(ActionProperty.ADDED, element, extractString(element)));
      } else {
        this.elementRegistry.delete(id);
      }
    });
    return actions;
  }

  async post(): Promise<Action[]> {
    await super.post();
    this.mutationObserver.disconnect();
    this.elementRegistry.clear();
    return this.currentOutputs();
  }
}