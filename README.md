# @library-pals/isbn

An npm module that given an ISBN will return the book's metadata using the
following providers:

- [Google Books API](https://developers.google.com/books/)
- [Open Library Books API](https://openlibrary.org/dev/docs/api/books)
- [WorldCat xISBN API](http://xisbn.worldcat.org/xisbnadmin/doc/api.htm)
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
import isbn from "@library-pals/isbn";

try {
  const book = await isbn.resolve("9780374104092");
  console.log("Book found %j", book);
} catch (err) {
  console.log("Book not found", err);
}
```

### Setting a timeout

```javascript
import isbn from "@library-pals/isbn";

try {
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

```json
{
  "title": "Annihilation",
  "subtitle": "A Novel",
  "authors": ["Jeff VanderMeer"],
  "publisher": "Macmillan",
  "publishedDate": "2014-02-04",
  "description": "Describes the 12th expedition to “Area X,” a region cut off from the continent for decades, by a group of intrepid women scientists who try to ignore the high mortality rates of those on the previous 11 missions. Original. 75,000 first printing.",
  "industryIdentifiers": [
    { "type": "ISBN_13", "identifier": "9780374104092" },
    { "type": "ISBN_10", "identifier": "0374104093" }
  ],
  "readingModes": { "text": false, "image": false },
  "pageCount": 209,
  "printType": "BOOK",
  "categories": ["Fiction"],
  "averageRating": 5,
  "ratingsCount": 1,
  "maturityRating": "NOT_MATURE",
  "allowAnonLogging": false,
  "contentVersion": "0.5.1.0.preview.0",
  "panelizationSummary": {
    "containsEpubBubbles": false,
    "containsImageBubbles": false
  },
  "imageLinks": {
    "smallThumbnail": "http://books.google.com/books/content?id=2cl7AgAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
    "thumbnail": "http://books.google.com/books/content?id=2cl7AgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
  },
  "language": "en",
  "previewLink": "http://books.google.com/books?id=2cl7AgAAQBAJ&printsec=frontcover&dq=isbn:9780374104092&hl=&cd=1&source=gbs_api",
  "infoLink": "http://books.google.com/books?id=2cl7AgAAQBAJ&dq=isbn:9780374104092&hl=&source=gbs_api",
  "canonicalVolumeLink": "https://books.google.com/books/about/Annihilation.html?hl=&id=2cl7AgAAQBAJ"
}
```

### Setting backend providers

You can optionally specify the providers that you want to use, in the order you
need them to be invoked.

```javascript
import isbn from "@library-pals/isbn";

// This request will search first in the Open Library API and then in the Google Books API
isbn.provider(["openlibrary", "google"]);

try {
  const book = await isbn.resolve("9780374104092");
  console.log("Book isbn:" + input + " found %j", book);
} catch (err) {
  console.log("Book isbn:" + input + " not found", err);
}
```

```javascript
import isbn from "@library-pals/isbn";

// This request will search ONLY in the Google Books API
isbn.provider( "google"]);

try {
  const book = await isbn.resolve("9780374104092");
  console.log("Book isbn:" + input + " found %j", book);
} catch (err) {
  console.log("Book isbn:" + input + " not found", err);
}
```

If you do not like using strings to specify the providers, you could grab the
providers from `isbn.PROVIDER_NAMES` constant that the library provides!

```javascript
import isbn from "@library-pals/isbn";

// This request will search ONLY in the Google Books API
isbn.provider([isbn.PROVIDER_NAMES.GOOGLE]);

try {
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
[WorldCat xISBN Terms of Service](http://www.oclc.org/worldcat/community/terms.en.html),
[ISBNdb Terms and Conditions](https://isbndb.com/terms-and-conditions).
