import { BaseRecord } from './BaseRecord';
import { RequireAtLeastOne } from './utils';

export type UserRole = 'STANDARD' | 'ADMIN' | 'GOD' | 'FROZEN';

export interface User extends BaseRecord {
  email: string;
  image?: string | null;
  name?: string | null;
  key: string;
  role: UserRole;
  aliases: string[];
}

export type UserRecord = Required<User>;
export type UserCreatePayload = Pick<UserRecord, 'email' | 'role'>;
export type UserUpdatePayload = Pick<UserRecord, 'id'> &
  RequireAtLeastOne<Omit<UserRecord, 'id'>>;
export type UserGetPayload = RequireAtLeastOne<
  Pick<UserRecord, 'id' | 'email'>
>;
export type UserDeletePayload = UserGetPayload;

export type UserGetManyPayload = RequireAtLeastOne<{
  ids: UserRecord['id'][];
  emails: UserRecord['email'][];
}>;
export type UserDeleteManyPayload = UserGetManyPayload;
