import { BaseRecord } from './BaseRecord';
import { RequireAtLeastOne } from './utils';

export interface Function extends BaseRecord {
  alias: string;
  code: string;
  language: string;
  total_calls: number;
  remaining_calls?: number | null;
  anonymous?: boolean | null;
  frozen?: boolean | null;
  created_by?: string | null;
  belongs_to?: string[] | null;
}

export type FunctionRecord = Required<Function>;
export type FunctionCreatePayload = Pick<
  FunctionRecord,
  'code' | 'language' | 'anonymous' | 'created_by' | 'belongs_to'
>;
export type FunctionUpdatePayload = RequireAtLeastOne<
  Pick<FunctionRecord, 'id' | 'alias'>
> &
  RequireAtLeastOne<Omit<FunctionRecord, 'id' | 'alias'>>;
export type FunctionGetPayload = RequireAtLeastOne<
  Pick<FunctionRecord, 'id' | 'alias'>
>;
export type FunctionDeletePayload = FunctionGetPayload;

export type FunctionGetManyPayload = RequireAtLeastOne<{
  ids: FunctionRecord['id'][];
  aliases: FunctionRecord['alias'][];
}>;
export type FunctionDeleteManyPayload = FunctionGetManyPayload;
