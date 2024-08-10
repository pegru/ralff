import {Action, generateActionForValidity} from '../utils/action-generator';

export class Validity {
  private readonly element: Element;
  public readonly badInput: boolean;
  public readonly customError: boolean;
  public readonly patternMismatch: boolean;
  public readonly rangeOverflow: boolean;
  public readonly rangeUnderflow: boolean;
  public readonly stepMismatch: boolean;
  public readonly tooLong: boolean;
  public readonly tooShort: boolean;
  public readonly typeMismatch: boolean;
  public readonly valid: boolean;
  public readonly valueMissing: boolean;

  private constructor(m: ValidityState, e: Element) {
    this.element = e;
    this.badInput = m.badInput;
    this.customError = m.customError;
    this.patternMismatch = m.patternMismatch;
    this.rangeOverflow = m.rangeOverflow;
    this.rangeUnderflow = m.rangeUnderflow;
    this.stepMismatch = m.stepMismatch;
    this.tooLong = m.tooLong;
    this.tooShort = m.tooShort;
    this.typeMismatch = m.typeMismatch;
    this.valid = m.valid;
    this.valueMissing = m.valueMissing;
  }

  public static fromElement(e: HTMLElement | undefined) {
    if (!e) {
      return undefined;
    }
    const validityState = (e as HTMLInputElement).validity;
    if (validityState) {
      return new Validity(validityState, e);
    }
    return undefined;
  }

  public static compare(preValidity: Validity | undefined, postValidity: Validity | undefined): Action[] {
    const actions: Action[] = [];
    if (!preValidity || !postValidity) {
      return actions;
    }
    if (preValidity.badInput !== postValidity.badInput) {
      actions.push(generateActionForValidity(preValidity.element, 'badInput', postValidity.badInput));
      // console.log("badInput", this.badInput, postValidity.badInput);
    }
    if (preValidity.customError !== postValidity.customError) {
      actions.push(generateActionForValidity(preValidity.element, 'customError', postValidity.customError));
      // console.log("customError", this.customError, postValidity.customError);
    }
    if (preValidity.patternMismatch !== postValidity.patternMismatch) {
      actions.push(generateActionForValidity(preValidity.element, 'patternMismatch', postValidity.patternMismatch));
      // console.log("patternMismatch", this.patternMismatch, postValidity.patternMismatch);
    }
    if (preValidity.rangeOverflow !== postValidity.rangeOverflow) {
      actions.push(generateActionForValidity(preValidity.element, 'rangeOverflow', postValidity.rangeOverflow));
      // console.log("rangeOverflow", this.rangeOverflow, postValidity.rangeOverflow);
    }
    if (preValidity.rangeUnderflow !== postValidity.rangeUnderflow) {
      actions.push(generateActionForValidity(preValidity.element, 'rangeUnderflow', postValidity.rangeUnderflow));
      // console.log("rangeUnderflow", this.rangeUnderflow, postValidity.rangeUnderflow);
    }
    if (preValidity.stepMismatch !== postValidity.stepMismatch) {
      actions.push(generateActionForValidity(preValidity.element, 'stepMismatch', postValidity.stepMismatch));
      // console.log("stepMismatch", this.stepMismatch, postValidity.stepMismatch);
    }
    if (preValidity.tooLong !== postValidity.tooLong) {
      actions.push(generateActionForValidity(preValidity.element, 'tooLong', postValidity.tooLong));
      // console.log("tooLong", this.tooLong, postValidity.tooLong);
    }
    if (preValidity.tooShort !== postValidity.tooShort) {
      actions.push(generateActionForValidity(preValidity.element, 'tooShort', postValidity.tooShort));
      // console.log("tooShort", this.tooShort, postValidity.tooShort);
    }
    if (preValidity.typeMismatch !== postValidity.typeMismatch) {
      actions.push(generateActionForValidity(preValidity.element, 'typeMismatch', postValidity.typeMismatch));
      // console.log("typeMismatch", this.typeMismatch, postValidity.typeMismatch);
    }
    if (preValidity.valueMissing !== postValidity.valueMissing) {
      actions.push(generateActionForValidity(preValidity.element, 'valueMissing', postValidity.valueMissing));
      // console.log("valueMissing", this.valueMissing, postValidity.valueMissing);
    }

    return actions;
  }

  public toStateAction(): Action[] {
    const actions: Action[] = [];
    // for now just simplify to valid
    actions.push(generateActionForValidity(this.element, 'valid', this.valid));
    return actions;
  }
}