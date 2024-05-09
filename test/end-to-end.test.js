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
    await expect(isbn.resolve("0374710775")).resolves.toMatchInlineSnapshot(`
{
  "authors": [
    "Jeff VanderMeer",
  ],
  "categories": [
    "Fiction",
  ],
  "description": "A MAJOR MOTION PICTURE FROM ALEX GARLAND, STARRING NATALIE PORTMAN AND OSCAR ISAAC The Southern Reach Trilogy begins with Annihilation, the Nebula Award-winning novel that "reads as if Verne or Wellsian adventurers exploring a mysterious island had warped through into a Kafkaesque nightmare world" (Kim Stanley Robinson). Area X has been cut off from the rest of the continent for decades. Nature has reclaimed the last vestiges of human civilization. The first expedition returned with reports of a pristine, Edenic landscape; the second expedition ended in mass suicide; the third expedition in a hail of gunfire as its members turned on one another. The members of the eleventh expedition returned as shadows of their former selves, and within weeks, all had died of cancer. In Annihilation, the first volume of Jeff VanderMeer's Southern Reach trilogy, we join the twelfth expedition. The group is made up of four women: an anthropologist; a surveyor; a psychologist, the de facto leader; and our narrator, a biologist. Their mission is to map the terrain, record all observations of their surroundings and of one another, and, above all, avoid being contaminated by Area X itself. They arrive expecting the unexpected, and Area X delivers—they discover a massive topographic anomaly and life forms that surpass understanding—but it's the surprises that came across the border with them and the secrets the expedition members are keeping from one another that change everything.",
  "link": "https://play.google.com/store/books/details?id=qUo0AQAAQBAJ",
  "pageCount": 209,
  "printType": "BOOK",
  "publishedDate": "2014-02-04",
  "publisher": "FSG Originals",
  "thumbnail": "https://books.google.com/books?id=qUo0AQAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
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
  "link": "https://openlibrary.org/books/OL31444108M/Annihilation",
  "pageCount": 208,
  "printType": "BOOK",
  "publishedDate": "2014",
  "publisher": "Farrar, Straus and Giroux",
  "thumbnail": "https://covers.openlibrary.org/b/id/10520611-S.jpg",
  "title": "Annihilation",
}
`);
    isbn.provider(["openlibrary"]);
    await expect(isbn.resolve("0374710775")).resolves.toMatchInlineSnapshot(`
{
  "authors": [
    "Jeff VanderMeer",
  ],
  "categories": [],
  "description": undefined,
  "link": "https://openlibrary.org/books/OL26759325M/Annihilation_A_Novel_(The_Southern_Reach_Trilogy_Book_1)",
  "pageCount": 210,
  "printType": "BOOK",
  "publishedDate": "Feb 04, 2014",
  "publisher": "FSG Originals",
  "thumbnail": "https://covers.openlibrary.org/b/id/8408974-S.jpg",
  "title": "Annihilation: A Novel (The Southern Reach Trilogy Book 1)",
}
`);
  });
});
