import { resolveOpenLibrary } from "../../src/providers/open-library.js";
import axios from "axios";
import { jest } from "@jest/globals";

import openLibraryMock from "../fixtures/open-library-isbn-9781888363432.json";
import openLibraryWorksMock from "../fixtures/open-library-works-OL998749M.json";
import openLibraryAuthorsMock from "../fixtures/open-library-authors-OL29463A.json";

jest.mock("axios");

describe("resolveOpenLibrary", () => {
  const isbn = "9781888363432";

  it("should resolve book information successfully", async () => {
    const mockResponse = openLibraryMock;

    axios.get = jest.fn().mockImplementation((url) => {
      if (url.includes("/isbn")) {
        return Promise.resolve({ status: 200, data: mockResponse });
      } else if (url.includes("/works")) {
        return Promise.resolve({
          status: 200,
          data: openLibraryWorksMock,
        });
      } else if (url.includes("/authors")) {
        return Promise.resolve({
          status: 200,
          data: openLibraryAuthorsMock,
        });
      }
    });

    const book = await resolveOpenLibrary(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [],
        "bookProvider": "Open Library",
        "categories": [],
        "description": {
          "type": "/type/text",
          "value": "A work of fantasy, I Who Have Never Known Men is the haunting and unforgettable account of a near future on a barren earth where women are kept in underground cages guarded by uniformed groups of men. It is narrated by the youngest of the women, the only one with no memory of what the world was like before the cages, who must teach herself, without books or sexual contact, the essential human emotions of longing, loving, learning, companionship, and dying.",
        },
        "format": "book",
        "isbn": "9781888363432",
        "language": "en",
        "link": "https://openlibrary.org/books/OL998749M",
        "pageCount": 206,
        "publishedDate": "1997",
        "publisher": "Seven Stories Press",
        "thumbnail": "https://covers.openlibrary.org/b/id/936140-L.jpg",
        "title": "I who have never known men",
      }
    `);
  });
});
