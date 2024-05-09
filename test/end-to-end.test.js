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
  "description": undefined,
  "link": "https://openlibrary.org/books/OL31444108M/Annihilation",
  "pageCount": 208,
  "printType": "BOOK",
  "publishedDate": "2014",
  "publisher": "Farrar, Straus and Giroux",
  "thumbnail": "https://covers.openlibrary.org/b/id/10520611-L.jpg",
  "title": "Annihilation",
}
`);
  });
});
