import {compareID, extractIdentifier, extractString} from './control-utils';

export enum ActionProperty {
  CLICK = 'click',
  CHANGE = 'change',
  MUT_CHANGE = 'mutation-change',
  INPUT = 'input',
  DISABLED = 'disabled',
  CHILD_LIST = 'child-list',
  INVALID = 'invalid',
  ARIA_INVALID = 'aria-invalid',
  ARIA_DISABLED = 'aria-disabled',
  VALUE = 'value',
  ADDED = 'added',
  STYLE = 'style',
  REMOVED = 'removed',
  ID = 'id',
  UNKNOWN = 'unknown',
}

export class Action {
  public node: Element;
  public property: ActionProperty | string;
  public event: Event | MutationRecord | undefined;
  public value: string | undefined | boolean;

  constructor(property: ActionProperty | string, node: Element, event: Event | MutationRecord | undefined, text: string | undefined | boolean = undefined) {
    this.node = node;
    this.property = property;
    this.event = event;
    this.value = text;
  }

  static forEvent(type: ActionProperty, event: Event, text: string | undefined | boolean = undefined) {
    return new Action(type, event.target as Element, event, text);
  }

  static forMutation(type: ActionProperty, event: MutationRecord, text: string | undefined | boolean = undefined, node: Element | undefined = undefined) {
    return new Action(type, node ?? event.target as Element, event, text);
  }

  static custom(type: string, node: Element, value: string | boolean | undefined) {
    return new Action(type, node, undefined, value);
  }

  toJSON(): object {
    return {
      "node": extractIdentifier(this.node),
      "property": this.property.toString(),
      "value": this.value
    };
  }

  toHashableString(): string {
    return extractIdentifier(this.node) + this.property.toString() + this.value?.toString();
  }
}

/**
 * assumes that each action target node has an injected custom-id
 * @param a1 Action1
 * @param a2 Action2
 */
export function isCounterAction(a1: Action, a2: Action) {
  if (a1.property === ActionProperty.ADDED && a2.property === ActionProperty.REMOVED && compareID(a1.node, a2.node)) {
    return true;
  }
  if (a1.property === ActionProperty.REMOVED && a2.property === ActionProperty.ADDED && compareID(a1.node, a2.node)) {
    return true;
  }
  if ((a1.property === ActionProperty.ARIA_INVALID && a2.property === ActionProperty.ARIA_INVALID) ||
    (a1.property === ActionProperty.ARIA_DISABLED && a2.property === ActionProperty.ARIA_DISABLED) ||
    (a1.property === ActionProperty.DISABLED && a2.property === ActionProperty.DISABLED)
  ) {
    return a1.value === !a2.value;
  }
}

export function generateCustomAction(trigger: Event | MutationRecord): Action {
  if (trigger instanceof MutationRecord) {
    return generateCustomActionForMutation(trigger);
  } else {
    return generateCustomActionForEvent(trigger);
  }
}

export function generateActionForNode(node: Node, type: ActionProperty, event: MutationRecord) {
  return Action.forMutation(type, event, extractString(node), node as Element);
}

function generateCustomActionForMutation(mutation: MutationRecord): Action {
  const target = mutation.target as Node;
  const baseAction = Action.forMutation(ActionProperty.UNKNOWN, mutation, extractString(target));
  if (mutation.type === 'childList') {
    baseAction.property = ActionProperty.CHILD_LIST;
  } else if (mutation.type === 'attributes' && mutation.attributeName === 'aria-invalid') {
    baseAction.property = ActionProperty.ARIA_INVALID;
    baseAction.value = baseAction.node.getAttribute('aria-invalid') === 'true';
  } else if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
    baseAction.property = ActionProperty.MUT_CHANGE;
  } else if (mutation.type === 'attributes' && mutation.attributeName === 'aria-disabled') {
    baseAction.property = ActionProperty.ARIA_DISABLED;
    baseAction.value = baseAction.node.getAttribute('aria-disabled') === 'true';
  } else if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
    baseAction.property = ActionProperty.DISABLED;
    baseAction.value = baseAction.node.hasAttribute('disabled')
  } else if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
    baseAction.property = ActionProperty.ID;
  }

  return baseAction;
}

function generateCustomActionForEvent(event: Event): Action {
  const target = event.target as Node;
  const baseAction = Action.forEvent(ActionProperty.UNKNOWN, event, extractString(target));
  switch (event.type) {
    case 'click':
      baseAction.property = ActionProperty.CLICK;
      return baseAction;
    case 'invalid':
      baseAction.property = ActionProperty.INVALID;
      baseAction.value = (target as HTMLInputElement).validationMessage;
      return baseAction;
    case 'change':
      baseAction.property = ActionProperty.CHANGE;
      baseAction.value = extractString(target);
      return baseAction;
    case 'input':
      baseAction.property = ActionProperty.INPUT;
      baseAction.value = extractString(target);
      return baseAction;
    default:
      return baseAction;
  }
}

export function updateActionValue(action: Action) {
  switch (action.property) {
    // event
    case ActionProperty.INVALID:
    case ActionProperty.CHANGE:
    case ActionProperty.INPUT:
    // mutation
    case ActionProperty.MUT_CHANGE:
    case ActionProperty.REMOVED:
      // case ActionType.ADDED:
      action.value = extractString(action.node);
      break;
  }
}

export function generateActionForValidity(node: Element, type: string, newValue: boolean) {
  return Action.custom(type, node, newValue);
}