const getTimestamp = () => new Date().toISOString();

export const logInfo = (...messages: any[]) => {
  console.log(`[INFO] [${getTimestamp()}]`, ...messages);
};

export const logError = (...messages: any[]) => {
  console.error(`[ERROR] [${getTimestamp()}]`, ...messages);
};
