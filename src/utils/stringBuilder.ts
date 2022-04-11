export class StringBuilder {
  private stringsArray: string[];
  private separator: string = "";

  constructor() {
    this.stringsArray = [];
  }

  addSeparator = (separator: string) => {
    this.separator = separator;
  };

  append = (value: string) => {
    this.stringsArray.push(value);
  };

  removeLast = () => {
    if (!this.isEmpty()) {
      this.stringsArray.pop();
    }
  };

  toString = (): string => {
    return this.stringsArray.join(this.separator).toString();
  };

  clear = () => {
    this.stringsArray = [];
  };

  isEmpty = () => {
    return this.stringsArray.length === 0;
  };
}
