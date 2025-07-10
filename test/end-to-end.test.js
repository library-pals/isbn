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
    ])(
      "%s",
      async ({ providers }) => {
        isbn.provider(providers);
        await expect(isbn.resolve("9780374104092")).resolves.toMatchSnapshot();
      },
      15_000,
    );
  });

  describe("Transcendent Kingdom", () => {
    it.each([
      { name: "default", providers: [] },
      { name: "openlibrary", providers: ["openlibrary"] },
      { name: "google", providers: ["google"] },
    ])(
      "%s",
      async ({ providers }) => {
        isbn.provider(providers);
        await expect(isbn.resolve("9780385695176")).resolves.toMatchSnapshot();
      },
      15_000,
    );
  });

  describe("Fantastic Mr. Fox", () => {
    it.each([
      { name: "default", providers: [] },
      { name: "openlibrary", providers: ["openlibrary"] },
      { name: "google", providers: ["google"] },
    ])(
      "%s",
      async ({ providers }) => {
        isbn.provider(providers);
        await expect(isbn.resolve("9780142423431")).resolves.toMatchSnapshot();
      },
      15_000,
    );
  });

  describe("The Ministry of Time (audiobook)", () => {
    const browserHeaders = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    };
    it.each([{ name: "default", providers: ["librofm"] }])(
      "%s",
      async ({ providers }) => {
        isbn.provider(providers);
        try {
          const result = await isbn.resolve("9781797176888", {
            headers: browserHeaders,
          });
          expect(result).toMatchSnapshot();
        } catch (error) {
          // Skip test if it fails in CI environment (GitHub Actions)
          // This can happen when libro.fm returns different response codes (202) or blocks requests
          if (process.env.CI || process.env.GITHUB_ACTIONS) {
            console.log(
              "Skipping librofm test in CI environment due to:",
              error.message,
            );
            return;
          }
          throw error;
        }
      },
      15_000,
    );
  });
});
