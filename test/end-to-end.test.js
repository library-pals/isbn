import isbn from "../src/index.js";

describe("e2e", () => {
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
  "link": "https://books.google.com/books/about/Annihilation.html?hl=&id=2cl7AgAAQBAJ",
  "pageCount": 209,
  "printType": "BOOK",
  "publishedDate": "2014-02-04",
  "publisher": "Macmillan",
  "thumbnail": "https://books.google.com/books?id=2cl7AgAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
  "title": "Annihilation",
}
`);
  });

  it("openlibrary", async () => {
    isbn.provider(["openlibrary"]);
    await expect(isbn.resolve("9780374104092")).resolves.toMatchInlineSnapshot(`
{
  "authors": [],
  "categories": [],
  "description": undefined,
  "imageLinks": {
    "smallThumbnail": "https://covers.openlibrary.org/b/id/10520611-S.jpg",
    "thumbnail": "https://covers.openlibrary.org/b/id/10520611-S.jpg",
  },
  "industryIdentifiers": [],
  "infoLink": "https://openlibrary.org/books/OL31444108M/Annihilation",
  "language": "en",
  "pageCount": 208,
  "previewLink": "https://openlibrary.org/books/OL31444108M/Annihilation",
  "printType": "BOOK",
  "publishedDate": "2014",
  "publisher": "Farrar, Straus and Giroux",
  "title": "Annihilation",
}
`);
  });
});
