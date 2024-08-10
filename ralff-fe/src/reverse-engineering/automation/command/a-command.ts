import {AFinder, DummyFinder, QuerySelectorFinder} from './a-finder';

export abstract class ACommand {
  protected finder: AFinder;
  protected _symbol: string;

  protected constructor(symbol: string, finder: AFinder) {
    this._symbol = symbol;
    this.finder = finder;
  }

  abstract action(): boolean;

  isEnabled(): boolean {
    // TODO implement custom configuration for each command
    const e = this.finder.getElement();

    if (!e) return false;
    if (e.getAttribute('aria-disabled') === 'true') return false;
    if (e.hasAttribute('disabled')) return false;

    return true;
  }

  get element(): HTMLElement | undefined {
    return this.finder.getElement();
  }

  get symbol(): string {
    return this._symbol;
  }
}

export class ClickCommand extends ACommand {
  constructor(symbol: string, finder: AFinder) {
    super(symbol, finder);
  }

  action(): boolean {
    const e = this.finder.getElement();
    if (!e || !this.isEnabled()) {
      return false;
    }
    const cE = new Event('click', {bubbles: true})
    e.dispatchEvent(cE);
    return true;
  }
}

export class InputCommand extends ACommand {
  private readonly input: string;

  constructor(symbol: string, finder: AFinder, input: string) {
    super(symbol, finder);
    this.input = input;
  }

  action(): boolean {
    const e = this.finder.getElement();
    if (!e || !this.isEnabled()) {
      return false;
    }

    let nativeInputValueSetter;
    if (e instanceof HTMLInputElement) {
      nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    } else if (e instanceof HTMLTextAreaElement) {
      nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    }

    // react specific update event
    // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js; last accessed 08.02.2024
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(e, this.input);
      const event = new Event('change', {bubbles: true});
      e.dispatchEvent(event);
      return true;
    }
    return false;
  }


  isEnabled(): boolean {
    const isEnabled = super.isEnabled();
    if (!isEnabled) return false;

    // special case where this command is only enabled if it would lead to different input
    const v = this.finder.getElement()?.getAttribute('value');
    if (v === this.input) return false;

    return true;
  }
}

export class ResetCommand extends ACommand {
  constructor() {
    super("RESET", new QuerySelectorFinder('form'));
  }

  action(): boolean {
    const e = this.finder.getElement();
    if (e instanceof HTMLFormElement) {
      e.reset();
      return true;
    }
    return false;
  }

  isEnabled(): boolean {
    return true;
  }
}

export class DummyCommand extends ACommand {
  constructor(symbol: string) {
    super(symbol, new DummyFinder());
  }

  action(): boolean {
    return true;
  }

  isEnabled(): boolean {
    return true;
  }
}