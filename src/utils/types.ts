export interface Function {
  alias: string;
  // fun: (...args: any[]) => any;
  fun: string;
  total_calls: number;
  remaining_calls: number;
}

export interface User {
  email: string;
  aliases: string[];
  key: string;
}
