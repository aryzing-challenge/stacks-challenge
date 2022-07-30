import { getDataOrError, validatePrincipal } from "./utils";

describe("Utils", () => {
  describe("Principal address validation", () => {
    it("Returns error for short addresses", () => {
      expect(validatePrincipal("TOO_SHORT")).toBeTruthy();
      expect(
        validatePrincipal("ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJA")
      ).toBeNull();
    });
  });

  describe("Adapter for network requests", () => {
    it("Returns data when promise resolves", async () => {
      expect.assertions(2);

      // Quick mock of Response object with json method.
      //
      // Time permitting, a more robust appraoch could be to have Response
      // mocked globally in the Jest environment.
      class Response {
        async json() {
          return { error: "oops" };
        }
      }

      const promiseWithData = Promise.resolve("some data");
      const promiseWithError = Promise.reject(new Response());

      expect(await getDataOrError(() => promiseWithData)()).toBe("some data");

      getDataOrError(() => promiseWithError)().catch((e) =>
        expect(e).toBe("oops")
      );
    });
  });
});
