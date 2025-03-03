import {makeID} from './utils';

export const HTML_FORM = 'form';
export const HTML_CONTROLS = 'button, input, select, textarea';
export const HTML_INPUTS = 'input, select, textarea';

export const cloneElement = (e: Element) => {
  return e.cloneNode(true) as Element;
}

export function setCustomId(e: Node) {
  if (e instanceof Element && !e.hasAttribute("custom-id")) {
    const id = makeID(5);
    e.setAttribute("custom-id", id);
    return id;
  }
}

export function extractCustomId(e: Node) {
  if (e instanceof Element && e.hasAttribute("custom-id")) {
    const id = e.getAttribute("custom-id");
    return id ?? undefined;
  }
}

export function compareID(n1: Node | undefined, n2: Node | undefined) {
  if (!(n1 instanceof Element) || !(n2 instanceof Element)) {
    return false;
  }
  return n1.getAttribute('custom-id') === n2.getAttribute('custom-id')
}

export function findNodeWithCustomID(id: string) {
  return document.querySelector(`[custom-id="${id}"]`) ?? undefined;
}

const pruneIdentifier = (identifier: string) => {
  return identifier.trim();
}

export const extractIdentifier = (e: Element) => {
  // find control of element if we hold parent element
  const control = e.querySelector(HTML_CONTROLS);
  e = control ?? e;

  // const id = e.id;
  // if (e.id && e.id.length > 0) {
  //   return e.id;
  // }
  // extract label
  const label = document.querySelector(`[for="${e.id}"]`)
  if (label && label.textContent) {
    return pruneIdentifier(label.textContent);
  }

  // extract aria-label
  if (e.ariaLabel) {
    return e.ariaLabel;
  }

  // do not return id as it might change for design libraries, e.g. MUI
  // if (id) {
  //   return id;
  // }

  // special case button: return textcontent
  if (e instanceof HTMLButtonElement && e.textContent) {
    return pruneIdentifier(e.textContent);
  }

  if (e.localName) {
    return e.localName;
  }

  // return node type
  return e.tagName;
}

const filter = <K extends keyof HTMLElementTagNameMap>(node: Node, selector: K) => {
  if (node instanceof Element && node.matches(selector)) {
    return NodeFilter.FILTER_ACCEPT;
  } else {
    return NodeFilter.FILTER_SKIP;
  }
}

export const extractString = <K extends keyof HTMLElementTagNameMap>(node: Node, selector?: K) => {
  if (node instanceof Element) {
    const control = node.querySelector(HTML_CONTROLS);
    node = control ?? node;
  }

  const f = (node: Node) => filter(node, selector ?? '*' as K);
  const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ALL, f);

  let str = extractContent(node);
  while (str === undefined && treeWalker.nextNode()) {
    str = extractContent(treeWalker.currentNode);
  }
  return str ?? '';
}

export const extractContent = (node: Node) => {
  let value;
  if (node instanceof HTMLInputElement) {
    value = node.value;
  } else if (node instanceof HTMLTextAreaElement) {
    value = node.value;
  }
  value = value ?? node.textContent;
  return value ?? undefined;
}

