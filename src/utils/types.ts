export interface Function {
  alias: string;
  code: string;
  total_calls: number;
  remaining_calls: number;
  language: string;
}

export interface FunctionDatabaseEntity extends Function {
  anonymous: boolean;
  frozen: boolean;
}

export interface User {
  email: string;
  aliases: string[];
  key: string;
}
