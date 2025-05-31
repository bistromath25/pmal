// import { ExecutionEntry } from './ExecutionEntry';
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
  dummy: string;
  //   code: string;
  //   setCode: React.Dispatch<React.SetStateAction<string>>;
  //   language: string;
  //   setLanguage: React.Dispatch<React.SetStateAction<string>>;
  //   currentFunction: Function;
  //   setCurrentFunction: React.Dispatch<React.SetStateAction<Function>>;
  //   functions: Function[];
  //   setFunctions: React.Dispatch<React.SetStateAction<Function[]>>;
  //   executionEntries: ExecutionEntry[];
};
