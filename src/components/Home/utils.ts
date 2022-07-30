export const validatePrincipal = (principal: string) =>
  principal.length === 41
    ? null
    : "Invalid principal. Please check the address of the principal you want to inspect.";

/**
 * Adapter between @stacks/blockchain-api-client and react-query data & error
 * formats.
 */
export const getDataOrError = <T>(fn: () => Promise<T>) => {
  return async () => {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }
      const error = (await (err as Response).json()).error;
      throw error;
    }
  };
};
