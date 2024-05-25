# @library-pals/isbn

An npm module that given an ISBN will return the book's metadata using the
following providers:

- [Google Books API](https://developers.google.com/books/)
- [Open Library Books API](https://openlibrary.org/dev/docs/api/books)
- [ISBNdb API](https://isbndb.com/apidocs/v2) using API key in the environment
  variable `ISBNDB_API_KEY`

## Acknowledgements

This repository is a fork of
[node-isbn by Guido García <@palmerabollo>](https://github.com/palmerabollo/node-isbn).

## Installation

```bash
npm install @library-pals/isbn
```

Supports Node.js versions 20.x and greater.

## Examples

```javascript
import Isbn from "@library-pals/isbn";

try {
  const isbn = new Isbn();
  const book = await isbn.resolve("9780374104092");
  console.log("Book found %j", book);
} catch (err) {
  console.log("Book not found", err);
}
```

### Setting a timeout

```javascript
import Isbn from "@library-pals/isbn";

try {
  const isbn = new Isbn();
  const book = await isbn.resolve("9780374104092", { timeout: 15000 });
  console.log("Book found %j", book);
} catch (err) {
  console.log("Book not found", err);
}
```

### Response

Response follows the same schema, but some fields could depend on the service
that was used to find the book. In general, Google Books API returns more
information.

#### Response: Google

<!-- google 9780374104092 -->

```json
{
  "title": "Annihilation",
  "authors": ["Jeff VanderMeer"],
  "description": "Describes the 12th expedition to “Area X,” a region cut off from the continent for decades, by a group of intrepid women scientists who try to ignore the high mortality rates of those on the previous 11 missions. Original. 75,000 first printing.",
  "pageCount": 209,
  "printType": "BOOK",
  "categories": [
    "Fiction",
    "Fiction / General",
    "Fiction / Fantasy / General",
    "Fiction / Horror",
    "Fiction / Literary",
    "Fiction / Science Fiction / General",
    "Fiction / Science Fiction / Action & Adventure",
    "Fiction / Thrillers / Suspense",
    "Fiction / Dystopian"
  ],
  "thumbnail": "http://books.google.com/books/publisher/content?id=2cl7AgAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
  "link": "https://books.google.com/books/about/Annihilation.html?hl=&id=2cl7AgAAQBAJ",
  "publisher": "Macmillan",
  "publishedDate": "2014-02-04",
  "language": "en",
  "isbn": "9780374104092",
  "bookProvider": "Google Books"
}
```

#### Response: OpenLibrary

<!-- openlibrary 9780374104092 -->

```json
{
  "title": "Annihilation",
  "authors": ["Jeff VanderMeer"],
  "description": "Area X has been cut off from the rest of the continent for decades. Nature has reclaimed the last vestiges of human civilization. The twelfth expedition arrives expecting the unexpected, and Area X delivers. They discover a massive topographic anomaly and life-forms that surpass understanding. But it's the surprises that came across the border with them, and the secrets the expedition members are keeping from one another that change everything.",
  "pageCount": 208,
  "printType": "BOOK",
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
    "813/.54"
  ],
  "thumbnail": "https://covers.openlibrary.org/b/id/10520611-L.jpg",
  "link": "https://openlibrary.org/books/OL31444108M",
  "publisher": "Farrar, Straus and Giroux",
  "publishedDate": "2014",
  "language": "en",
  "isbn": "9780374104092",
  "bookProvider": "Open Library"
}
```

### Setting backend providers

You can optionally specify the providers that you want to use, in the order you
need them to be invoked.

```javascript
import Isbn from "@library-pals/isbn";

try {
  const isbn = new Isbn();
  // This request will search first in the Open Library API and then in the Google Books API
  isbn.provider(["openlibrary", "google"]);
  const book = await isbn.resolve("9780374104092");
  console.log("Book isbn:" + input + " found %j", book);
} catch (err) {
  console.log("Book isbn:" + input + " not found", err);
}
```

```javascript
import Isbn from "@library-pals/isbn";

try {
  const isbn = new Isbn();
  // This request will search ONLY in the Google Books API
  isbn.provider( "google"]);
  const book = await isbn.resolve("9780374104092");
  console.log("Book isbn:" + input + " found %j", book);
} catch (err) {
  console.log("Book isbn:" + input + " not found", err);
}
```

If you do not like using strings to specify the providers, you could grab the
providers from `isbn.PROVIDER_NAMES` constant that the library provides!

```javascript
import Isbn from "@library-pals/isbn";

try {
  const isbn = new Isbn();
  // This request will search ONLY in the Google Books API
  isbn.provider([isbn.PROVIDER_NAMES.GOOGLE]);

  const book = await isbn.resolve("9780374104092");
  console.log("Book isbn:" + input + " found %j", book);
} catch (err) {
  console.log("Book isbn:" + input + " not found", err);
}
```

## License

**AGPL v3.0 LICENSE** http://www.gnu.org/licenses/agpl-3.0.html

See also
[Google Books API Terms of Service](https://developers.google.com/books/terms),
[Open Library Licensing](https://openlibrary.org/developers/licensing),
[ISBNdb Terms and Conditions](https://isbndb.com/terms-and-conditions).
