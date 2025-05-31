import { ExecutionEntryRecord } from './ExecutionEntry';
import { FunctionRecord, FunctionUpdatePayload } from './Function';
import { User } from './User';
import { WrappedRequest } from './WrappedRequest';

export type AppContextValue = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  resetError: () => void;
  success: string | null;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  resetSuccess: () => void;
  ready: boolean;
  setReady: React.Dispatch<React.SetStateAction<boolean>>;
  wrappedRequest: WrappedRequest;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type UserContextValue = {
  user: User | null;
  ready: boolean;
  refreshUser: () => Promise<void>;
};

export type FunctionContextValue = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  currentFunction: FunctionRecord | null;
  setCurrentFunction: React.Dispatch<
    React.SetStateAction<FunctionRecord | null>
  >;
  functions: FunctionRecord[];
  executionEntries: ExecutionEntryRecord[];
  refreshFunctions: () => Promise<void>;
  getFunctionByAlias: (alias: string) => Required<FunctionRecord> | null;
  updateFunction: (payload: FunctionUpdatePayload) => Promise<void>;
  deleteFunction: (id: string) => Promise<void>;
};
