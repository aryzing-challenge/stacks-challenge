export const validatePrincipal = (principal: string) =>
  principal.length === 41
    ? null
    : "Invalid principal. Please check the address of the principal you want to inspect.";

/**
 * Adapter between @stacks/blockchain-api-client and react-query data & error
 * formats.
 */
export const getDataOrError = <T>(p: Promise<T>) => {
  return async () => {
    try {
      return await p;
    } catch (err) {
      const error = (await (err as Response).json()).error;
      throw error;
    }
  };
};
