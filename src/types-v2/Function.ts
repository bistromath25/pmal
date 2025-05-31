import { BaseRecord } from './BaseRecord';

export interface Function extends BaseRecord {
  user_id: string;
  language: string;
  code: string;
  total_calls: number;
  anonymous?: boolean | null;
  frozen?: boolean | null;
}

export type FunctionRecord = Required<Function>;
export type FunctionCreatePayload = Pick<
  Function,
  'language' | 'code' | 'anonymous'
>;
export type FunctionUpdatePayload = Pick<Function, 'id' | 'code'>;
