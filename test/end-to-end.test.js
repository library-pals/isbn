import Isbn from "../src/index.js";

describe("End to end", () => {
  let isbn;
  beforeEach(() => {
    isbn = new Isbn();
  });

  afterEach(() => {
    isbn = null;
  });

  describe("Annihilation", () => {
    it.each([
      { name: "default", providers: [] },
      { name: "openlibrary", providers: ["openlibrary"] },
      { name: "google", providers: ["google"] },
    ])("%s", async ({ providers }) => {
      isbn.provider(providers);
      await expect(isbn.resolve("9780374104092")).resolves.toMatchSnapshot();
    });
  }, 10_000);

  describe("Transcendent Kingdom", () => {
    it.each([
      { name: "default", providers: [] },
      { name: "openlibrary", providers: ["openlibrary"] },
      { name: "google", providers: ["google"] },
    ])("%s", async ({ providers }) => {
      isbn.provider(providers);
      await expect(isbn.resolve("9780385695176")).resolves.toMatchSnapshot();
    });
  }, 10_000);

  describe("Fantastic Mr. Fox", () => {
    it.each([
      { name: "default", providers: [] },
      { name: "openlibrary", providers: ["openlibrary"] },
      { name: "google", providers: ["google"] },
    ])("%s", async ({ providers }) => {
      isbn.provider(providers);
      await expect(isbn.resolve("9780142423431")).resolves.toMatchSnapshot();
    });
  }, 10_000);

  describe("The Ministry of Time (audiobook)", () => {
    it.each([{ name: "default", providers: ["librofm"] }])(
      "%s",
      async ({ providers }) => {
        isbn.provider(providers);
        await expect(isbn.resolve("9781797176888")).resolves.toMatchSnapshot();
      },
      10_000,
    );
  });
});
