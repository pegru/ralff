export abstract class AFinder {
  abstract getElement(): HTMLElement | undefined;
}

export class DummyFinder extends AFinder {
  getElement(): HTMLElement | undefined {
    return undefined;
  }
}

export class ByAttributeFinder extends AFinder {
  private readonly attribute: string;
  private readonly value: string;

  constructor(attribute: string, value: string) {
    super();
    this.attribute = attribute;
    this.value = value;
  }

  queryByAttribute(attribute: string, value: string): HTMLElement | undefined {
    const element = document.querySelector(`[${attribute}="${value}"]`);
    if (element instanceof HTMLElement) {
      return element as HTMLElement;
    }
    return undefined;
  }

  getElement(): HTMLElement | undefined {
    const element = this.queryByAttribute(this.attribute, this.value);
    if (element instanceof HTMLElement) {
      return element as HTMLElement;
    }
    return undefined;
  }
}

export class LabelFinder extends ByAttributeFinder {
  private readonly labelText: string;

  constructor(labelText: string) {
    super('', '');
    this.labelText = labelText;
  }

  getElement(): HTMLElement | undefined {
    const labels = Array.from(document.querySelectorAll('label'));
    const label = labels.find(l => l.innerText === this.labelText);
    if (!label) return undefined;

    const forAttr = label.getAttribute('for');
    if (!forAttr) return undefined;
    const element = this.queryByAttribute('id', forAttr);

    if (element instanceof HTMLElement) {
      return element as HTMLElement;
    }
    return undefined;
  }
}

export class FirstRoleFinder extends AFinder {
  private readonly role: string;
  private readonly content: string;


  constructor(role: string, content: string) {
    super();
    this.role = role;
    this.content = content;
  }

  getElement(): HTMLElement | undefined {
    const elements: HTMLElement[] = Array.from(document.querySelectorAll(this.role));
    const element = elements.find(e => e.innerText === this.content);
    if (element instanceof HTMLElement) {
      return element as HTMLElement;
    }
    return undefined;
  }
}

export class QuerySelectorFinder extends AFinder {
  private readonly selector: string;

  constructor(selector: string) {
    super();
    this.selector = selector;
  }

  getElement(): HTMLElement | undefined {
    const e = document.querySelector(this.selector) ?? undefined;
    if (e instanceof HTMLElement) {
      return e as HTMLElement;
    }
    return undefined;
  }

}