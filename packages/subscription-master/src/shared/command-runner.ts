// Define the generic shape of any Command in your system
export type Command<TData = unknown, TResult = unknown> = {
  name: string;
  data: TData;
  execute: () => Promise<TResult>;
};

export const createCommandRunner = (logger: (msg: string) => void) => {
  return async <TData, TResult>(command: Command<TData, TResult>): Promise<TResult> => {
    const startTime = Date.now();
    logger(`[COMMAND START]: ${command.name}`);

    try {
      const result = await command.execute();
      const duration = Date.now() - startTime;
      logger(`[COMMAND SUCCESS]: ${command.name} (${duration}ms)`);
      return result;
    } catch (error) {
      logger(`[COMMAND ERROR]: ${command.name} - ${error}`);
      // You could integrate Sentry or error reporting here
      throw error;
    }
  };
};