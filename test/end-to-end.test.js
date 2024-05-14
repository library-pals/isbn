import Isbn from "../src/index.js";

describe("End to end", () => {
  let isbn;
  beforeEach(() => {
    isbn = new Isbn();
  });

  afterEach(() => {
    isbn = null;
  });

  it("default", async () => {
    await expect(isbn.resolve("9780374104092")).resolves.toMatchInlineSnapshot(`
      {
        "authors": [
          "Jeff VanderMeer",
        ],
        "categories": [
          "Fiction",
        ],
        "description": "Describes the 12th expedition to “Area X,” a region cut off from the continent for decades, by a group of intrepid women scientists who try to ignore the high mortality rates of those on the previous 11 missions. Original. 75,000 first printing.",
        "isbn": "9780374104092",
        "link": "https://books.google.com/books/about/Annihilation.html?hl=&id=2cl7AgAAQBAJ",
        "pageCount": 209,
        "printType": "BOOK",
        "thumbnail": "http://books.google.com/books/content?id=2cl7AgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        "title": "Annihilation",
      }
    `);
  }, 10_000);

  it("openlibrary", async () => {
    isbn.provider([isbn.PROVIDER_NAMES.OPENLIBRARY]);
    await expect(isbn.resolve("9780374104092")).resolves.toMatchInlineSnapshot(`
      {
        "authors": [
          "Jeff VanderMeer",
        ],
        "categories": [
          "Nebula Award Winner",
          "award:nebula_award=novel",
          "award:nebula_award=2015",
          "Discoveries in geography",
          "Fiction",
          "Scientists",
          "Science-Fiction",
          "Suspense fiction",
          "Paranormal fiction",
          "Women scientists",
          "Science fiction",
          "Fantasy fiction",
          "Mystery fiction",
          "Adventure fiction",
          "Exploration",
          "Amerikanisches Englisch",
          "Fiction, science fiction, action & adventure",
          "Fiction, suspense",
          "Action & Adventure",
          "Dystopian",
          "Fantasy",
          "Extrasensory perception",
          "Literary",
          "Suspense",
          "Thrillers",
          "General",
          "Pollution",
          "horror",
          "body horror",
          "alien invasion",
          "nyt:trade-fiction-paperback=2018-03-18",
          "New York Times bestseller",
          "Explorers",
          "Secrecy",
          "Scientific expeditions",
          "Psychic ability",
          "Fiction, thrillers, suspense",
          "Discoveries in geography--fiction",
          "Scientists--fiction",
          "Women scientists--fiction",
          "Ps3572.a4284 a84 2014",
          "813/.54",
        ],
        "description": "Area X has been cut off from the rest of the continent for decades. Nature has reclaimed the last vestiges of human civilization. The twelfth expedition arrives expecting the unexpected, and Area X delivers. They discover a massive topographic anomaly and life-forms that surpass understanding. But it's the surprises that came across the border with them, and the secrets the expedition members are keeping from one another that change everything.",
        "isbn": "9780374104092",
        "link": "https://openlibrary.org/books/OL31444108M",
        "pageCount": 208,
        "printType": "BOOK",
        "thumbnail": "https://covers.openlibrary.org/b/id/10520611-L.jpg",
        "title": "Annihilation",
      }
    `);
  }, 10_000);

  it("google", async () => {
    isbn.provider([isbn.PROVIDER_NAMES.GOOGLE]);
    await expect(isbn.resolve("9780374104092")).resolves.toMatchInlineSnapshot(`
      {
        "authors": [
          "Jeff VanderMeer",
        ],
        "categories": [
          "Fiction",
        ],
        "description": "Describes the 12th expedition to “Area X,” a region cut off from the continent for decades, by a group of intrepid women scientists who try to ignore the high mortality rates of those on the previous 11 missions. Original. 75,000 first printing.",
        "isbn": "9780374104092",
        "link": "https://books.google.com/books/about/Annihilation.html?hl=&id=2cl7AgAAQBAJ",
        "pageCount": 209,
        "printType": "BOOK",
        "thumbnail": "http://books.google.com/books/content?id=2cl7AgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        "title": "Annihilation",
      }
    `);
  }, 10_000);
});
