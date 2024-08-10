export class Logger {
  private _enabled: boolean;
  private readonly name: string | undefined;

  constructor(enabled: boolean, name?: string) {
    this._enabled = enabled;
    this.name = name;
  }

  log(message?: any, ...optionalParams: any[]) {
    if (this._enabled) {
      const prefix = this.name ? `${this.name}:` : 'n/a';
      console.log(prefix, message, ...optionalParams);
    }
  }

  info(message?: any, ...optionalParams: any[]) {
    const prefix = this.name ? `${this.name}:` : 'n/a';
    console.log(prefix, message, ...optionalParams);
  }


  set enabled(value: boolean) {
    this._enabled = value;
  }
}