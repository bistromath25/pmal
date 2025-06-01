import { BaseRecord } from './BaseRecord';

export interface ExecutionEntry extends BaseRecord {
  function_id: string;
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
export type ExecutionEntryCreatePayload = Pick<
  ExecutionEntry,
  | 'function_id'
  | 'user_id'
  | 'code'
  | 'language'
  | 'query'
  | 'started_at'
  | 'ended_at'
  | 'time'
  | 'result'
>;
