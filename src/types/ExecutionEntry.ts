import { BaseRecord } from './BaseRecord';
import { RequireAtLeastOne } from './utils';

export interface ExecutionEntry extends BaseRecord {
  function_id: string;
  function_alias: string;
  user_id: string | null;
  code: string;
  language: string;
  query: string | null;
  started_at: Date;
  ended_at?: Date;
  time?: number;
  result?: string | null;
}

export type ExecutionEntryRecord = Required<ExecutionEntry>;
export type ExecutionEntryCreatePayload = Omit<ExecutionEntryRecord, 'id'>;
export type ExecutionEntryGetPayload = Pick<ExecutionEntryRecord, 'id'>;

export type ExecutionEntryGetManyPayload = RequireAtLeastOne<
  Pick<ExecutionEntryRecord, 'function_id' | 'function_alias'>
>;
export type ExecutionEntryDeleteManyPayload = ExecutionEntryGetManyPayload;
