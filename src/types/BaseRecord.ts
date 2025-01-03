export interface BaseRecord {
  id: string;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
