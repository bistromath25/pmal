import { BaseRecord } from './BaseRecord';

export interface User extends BaseRecord {
  email: string;
  name: string;
}

export type UserRecord = Required<User>;
