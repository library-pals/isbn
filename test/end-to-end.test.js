import Isbn from "../src/index.js";

describe("End to end", () => {
  let isbn;
  beforeEach(() => {
    isbn = new Isbn();
  });

  afterEach(() => {
    isbn = null;
  });

  it.each([
    { name: "default", providers: [] },
    { name: "openlibrary", providers: ["openlibrary"] },
    { name: "google", providers: ["google"] },
  ])(
    "%s Annihilation",
    async ({ providers }) => {
      isbn.provider(providers);
      await expect(isbn.resolve("9780374104092")).resolves.toMatchSnapshot();
    },
    10_000,
  );

  it.each([
    { name: "default", providers: [] },
    { name: "openlibrary", providers: ["openlibrary"] },
    { name: "google", providers: ["google"] },
  ])(
    "%s Transcendent Kingdom",
    async ({ providers }) => {
      isbn.provider(providers);
      await expect(isbn.resolve("9780385695176")).resolves.toMatchSnapshot();
    },
    10_000,
  );

  it.each([
    { name: "default", providers: [] },
    { name: "openlibrary", providers: ["openlibrary"] },
    { name: "google", providers: ["google"] },
  ])(
    "%s Fantastic Mr. Fox",
    async ({ providers }) => {
      isbn.provider(providers);
      await expect(isbn.resolve("9780140328721")).resolves.toMatchSnapshot();
    },
    10_000,
  );
});
