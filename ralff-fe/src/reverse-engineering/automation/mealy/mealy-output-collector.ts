import {
  Action,
  ActionProperty,
  generateActionForNode,
  generateCustomAction,
  isCounterAction,
  updateActionValue
} from '../../utils/action-generator';
import {OUTPUT_EVENTS} from '../../events';
import {compareID, extractCustomId, findNodeWithCustomID, HTML_CONTROLS, setCustomId} from '../../utils/control-utils';
import {makeID} from '../../utils/utils';
import {Logger} from '../../utils/logger';
import {RunConfig} from '../../run-config';
import {ACollector} from '../a-collector';

export class MealyOutputCollector extends ACollector {
  protected actions: Action[];
  private elementRegistry: Set<string>;
  private contentMap: Map<string, string>;
  private readonly attributeFilter: string[] = ['aria-invalid', 'disabled', 'aria-disabled', 'style'];
  private readonly observerConfig: MutationObserverInit = {
    attributes: true,
    attributeFilter: this.attributeFilter,
    childList: true,
    subtree: true
  };


  constructor() {
    super();
    this.actions = [];
    this.mutationObserver = new MutationObserver((mutations, observer) => this.mutationObserverCB(mutations, observer));
    this.logger = new Logger(RunConfig.executorLogging, this.constructor.name);
    this.elementRegistry = new Set<string>();
    this.contentMap = new Map<string, string>();
  }

  outputEventCB(ev: Event) {
    this.uiSettled = false;
    // TODO extract HTML built-in validityState and compare afterwards
    const action = generateCustomAction(ev);
    if (ev.target instanceof Element) {
      setCustomId(ev.target);
    }
    this.actions.push(action);
  }

  mutationObserverCB(mutationList: MutationRecord[], _: MutationObserver) {
    this.uiSettled = false;
    mutationList.forEach(record => {
      if (record.type === 'childList') {
        // addedNodes
        record.addedNodes.forEach(n => {
          const id = setCustomId(n);
          id && this.elementRegistry.add(id);

          const action = generateActionForNode(n, ActionProperty.ADDED, record);
          this.actions.push(action);
        });

        // removedNodes
        record.removedNodes.forEach(n => {
          const id = setCustomId(n);
          id && this.elementRegistry.delete(id);

          const action = generateActionForNode(n, ActionProperty.REMOVED, record);
          this.actions.push(action);
        });
      } else if (record.attributeName === 'style') {
        // Bugfix: applying invalid input after invalid input does not detect error message:
        // check if it was added before over custom-id
        // always replace previous with newer detection
        const id = extractCustomId(record.target);
        const textContent = record?.target?.textContent ?? undefined;
        if (textContent && id && this.contentMap.has(id) && this.contentMap.get(id) !== textContent) {
          // update contentMap
          this.contentMap.set(id, textContent);

          const action = generateActionForNode(record.target, ActionProperty.STYLE, record);
          const index = this.actions.findIndex(a => a.property === action.property);
          if (index !== -1) {
            this.actions[index] = action;
          } else {
            this.actions.push(action);
          }
        }
      } else {
        this.actions.push(generateCustomAction(record));
        if (record.target instanceof Element) {
          setCustomId(record.target);
          record.target.setAttribute("custom-id", makeID(5));
        }
      }
    })
  }

  pre(): void {
    super.pre();
    this.mutationObserver.observe(this.target, this.observerConfig);
    OUTPUT_EVENTS.forEach(eventString => {
      this.target.addEventListener(eventString, evt => this.outputEventCB(evt), {
        capture: true,
        passive: false,
      });
    });
    this.elementRegistry.clear();
  }

  private pruneOutputs() {
    // prune outputs according to there reverse action
    const arr: Action[] = []
    this.actions.forEach(o => {
      const counterAction = this.actions.find(o2 => isCounterAction(o, o2));
      if (counterAction === undefined) {
        arr.push(o);
      }
    });
    this.actions = Array.from(arr);
    // this.actions = this.actions.filter(a => a.property !== ActionProperty.MUT_CHANGE)
    // this.actions = this.actions.filter(a => a.property !== ActionProperty.CHANGE)
  }

  private removeDuplicates() {
    this.actions.forEach(e => updateActionValue(e));
    // remove duplicates
    const arr: Action[] = [];
    this.actions.forEach(e => {
      const action = arr.find(a => compareID(a.node, e.node) && a.value === e.value);
      if (!action) {
        arr.push(e);
      }
    });
    this.actions = arr;
  }

  async currentOutputs(): Promise<Action[]> {
    await this.waitForUi();
    // prune outputs of events that were reverted
    this.pruneOutputs();
    this.removeDuplicates();

    this.actions.forEach(o => this.logger.log(o));
    return this.actions;
  }

  reset() {
    this.actions = [];
  }

  prepare() {
    // extract content
    this.elementRegistry.forEach(id => {
      const element = findNodeWithCustomID(id);
      if (element && !element.matches(HTML_CONTROLS)) {
        this.contentMap.set(id, element.textContent ?? '');
      }
    });
  }

  async post(): Promise<Action[]> {
    // disconnect observers
    await super.post();
    this.mutationObserver.disconnect();
    OUTPUT_EVENTS.forEach(eventString => {
      this.target.removeEventListener(eventString, evt => this.outputEventCB(evt));
    });
    this.elementRegistry.clear();
    this.contentMap.clear();
    const actions = [...this.actions];
    this.actions = []
    return actions;
  }
}