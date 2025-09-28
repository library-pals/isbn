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

  // describe("The Ministry of Time (audiobook)", () => {
  //   const browserHeaders = {
  //     "User-Agent":
  //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  //     Accept:
  //       "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  //     "Accept-Language": "en-US,en;q=0.9",
  //     "Accept-Encoding": "gzip, deflate, br",
  //     "Cache-Control": "no-cache",
  //     Pragma: "no-cache",
  //     Connection: "keep-alive",
  //     "Upgrade-Insecure-Requests": "1",
  //     "Sec-Fetch-Dest": "document",
  //     "Sec-Fetch-Mode": "navigate",
  //     "Sec-Fetch-Site": "none",
  //     "Sec-Fetch-User": "?1",
  //     DNT: "1",
  //     "Sec-GPC": "1",
  //   };
  //   it.each([{ name: "default", providers: ["librofm"] }])(
  //     "%s",
  //     async ({ providers }) => {
  //       isbn.provider(providers);

  //       // Add a small delay before the request to avoid rate limiting
  //       await new Promise((resolve) => setTimeout(resolve, 1000));

  //       let result;
  //       let retries = 0;
  //       const maxRetries = 3;

  //       while (retries < maxRetries) {
  //         try {
  //           result = await isbn.resolve("9781797176888", {
  //             headers: browserHeaders,
  //             timeout: 30_000, // Increase timeout
  //             maxRedirects: 5, // Allow redirects
  //           });
  //           break; // Success, exit loop
  //         } catch (error) {
  //           retries++;
  //           if (retries >= maxRetries) {
  //             throw error; // Re-throw if we've exhausted retries
  //           }
  //           // Wait before retry
  //           await new Promise((resolve) => setTimeout(resolve, 2000));
  //         }
  //       }

  //       expect(result).toMatchSnapshot();
  //     },
  //     60_000, // Increased timeout for the test with retries
  //   );
  // });
});
