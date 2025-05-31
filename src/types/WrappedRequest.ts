export type WrappedRequest = <T>(
  promise: () => Promise<T>
) => Promise<T | null>;
