export class SessionCtx {
  public oldSessionId: string | undefined;
  public newSessionId: string | undefined;

  constructor(oldSessionId: string | undefined, newSessionId: string | undefined) {
    this.oldSessionId = oldSessionId;
    this.newSessionId = newSessionId;
  }
}