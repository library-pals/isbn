import {
  resolveOpenLibrary,
  standardize,
  getDescription,
} from "../../src/providers/open-library.js";
import axios from "axios";
import { jest } from "@jest/globals";

jest.mock("axios");

const mockSearchResponse = (document) => ({
  status: 200,
  data: { numFound: 1, docs: [document] },
});

const mockDocument = {
  title: "Fantastic Mr Fox",
  author_name: ["Roald Dahl"],
  number_of_pages_median: 96,
  subject: [
    "Animals",
    "Hunger",
    "Open Library Staff Picks",
    "Juvenile fiction",
    "Foxes",
    "Fiction",
  ],
  cover_i: 6_498_519,
  key: "/works/OL45804W",
  editions: {
    docs: [
      {
        key: "/books/OL7353617M",
        title: "Fantastic Mr. Fox",
        cover_i: 8_739_161,
        language: ["eng"],
        publisher: ["Puffin"],
        publish_date: ["October 1, 1988"],
      },
    ],
  },
};

describe("resolveOpenLibrary", () => {
  const isbn = "9780140328721";

  it("should resolve book information successfully", async () => {
    axios.get = jest.fn().mockImplementation((url) => {
      if (url.includes("/search.json")) {
        return Promise.resolve(mockSearchResponse(mockDocument));
      }
      return Promise.resolve({
        status: 200,
        data: { description: "A story about a clever fox." },
      });
    });
    const book = await resolveOpenLibrary(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [
          "Roald Dahl",
        ],
        "bookProvider": "Open Library",
        "categories": [
          "Animals",
          "Hunger",
          "Open Library Staff Picks",
          "Juvenile fiction",
          "Foxes",
          "Fiction",
        ],
        "description": "A story about a clever fox.",
        "format": "book",
        "isbn": "9780140328721",
        "language": "en",
        "link": "https://openlibrary.org/books/OL7353617M",
        "pageCount": 96,
        "publishedDate": "October 1, 1988",
        "publisher": "Puffin",
        "thumbnail": "https://covers.openlibrary.org/b/id/8739161-L.jpg",
        "title": "Fantastic Mr. Fox",
      }
    `);
  });

  it("should use empty description when no work key", async () => {
    const documentWithoutKey = { ...mockDocument, key: undefined };
    axios.get = jest
      .fn()
      .mockResolvedValue(mockSearchResponse(documentWithoutKey));
    const book = await resolveOpenLibrary(isbn, {});
    expect(book.description).toBe("");
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("should resolve when no edition data is present", async () => {
    const documentWithoutEditions = {
      title: "Fantastic Mr Fox",
      author_name: ["Roald Dahl"],
      number_of_pages_median: 96,
      subject: ["Fiction"],
      cover_i: 6_498_519,
      key: "/works/OL45804W",
    };
    axios.get = jest.fn().mockImplementation((url) => {
      if (url.includes("/search.json")) {
        return Promise.resolve(mockSearchResponse(documentWithoutEditions));
      }
      return Promise.resolve({ status: 200, data: {} });
    });
    const book = await resolveOpenLibrary(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [
          "Roald Dahl",
        ],
        "bookProvider": "Open Library",
        "categories": [
          "Fiction",
        ],
        "description": "",
        "format": "book",
        "isbn": "9780140328721",
        "language": undefined,
        "link": "https://openlibrary.org/works/OL45804W",
        "pageCount": 96,
        "publishedDate": undefined,
        "publisher": undefined,
        "thumbnail": "https://covers.openlibrary.org/b/id/6498519-L.jpg",
        "title": "Fantastic Mr Fox",
      }
    `);
  });

  it("should resolve when no cover or key is present", async () => {
    const documentMinimal = { title: "Minimal Book", author_name: [] };
    axios.get = jest
      .fn()
      .mockResolvedValue(mockSearchResponse(documentMinimal));
    const book = await resolveOpenLibrary(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [],
        "bookProvider": "Open Library",
        "categories": [],
        "description": "",
        "format": "book",
        "isbn": "9780140328721",
        "language": undefined,
        "link": "https://openlibrary.org/isbn/9780140328721",
        "pageCount": undefined,
        "publishedDate": undefined,
        "publisher": undefined,
        "thumbnail": undefined,
        "title": "Minimal Book",
      }
    `);
  });

  it("should throw an error if no books are found", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValue({ status: 200, data: { numFound: 0, docs: [] } });
    await expect(resolveOpenLibrary(isbn, {})).rejects.toThrow(
      `No books found with ISBN: ${isbn}`,
    );
  });

  it("should throw an error if the response status is not 200", async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 404, data: {} });
    await expect(resolveOpenLibrary(isbn, {})).rejects.toThrow(
      "Wrong response code: 404",
    );
  });
});

describe("standardize", () => {
  const isbn = "9781888363432";

  it("should standardize a full search doc", () => {
    const document = {
      title: "Moi qui n'ai pas connu les hommes",
      author_name: ["Jacqueline Harpman", "Ros Schwartz"],
      number_of_pages_median: 208,
      subject: ["Fiction, fantasy, general", "New York Times reviewed"],
      cover_i: 7_487_522,
      key: "/works/OL102360W",
      editions: {
        docs: [
          {
            key: "/books/OL998749M",
            title: "I who have never known men",
            cover_i: 936_140,
            language: ["eng"],
            publisher: ["Seven Stories Press"],
            publish_date: ["1997"],
          },
        ],
      },
    };
    expect(standardize(document, isbn, "A haunting story."))
      .toMatchInlineSnapshot(`
      {
        "authors": [
          "Jacqueline Harpman",
          "Ros Schwartz",
        ],
        "bookProvider": "Open Library",
        "categories": [
          "Fiction, fantasy, general",
          "New York Times reviewed",
        ],
        "description": "A haunting story.",
        "format": "book",
        "isbn": "9781888363432",
        "language": "en",
        "link": "https://openlibrary.org/books/OL998749M",
        "pageCount": 208,
        "publishedDate": "1997",
        "publisher": "Seven Stories Press",
        "thumbnail": "https://covers.openlibrary.org/b/id/936140-L.jpg",
        "title": "I who have never known men",
      }
    `);
  });

  it("should use empty string for description when not provided", () => {
    const document = { title: "Test", key: "/works/OL1W" };
    expect(standardize(document, isbn).description).toBe("");
  });

  it("should handle unknown language code", () => {
    const document = {
      title: "Test",
      editions: { docs: [{ key: "/books/OL1M", language: ["xyz"] }] },
    };
    expect(standardize(document, isbn).language).toBeUndefined();
  });

  it("should handle empty language array", () => {
    const document = {
      title: "Test",
      editions: { docs: [{ key: "/books/OL1M", language: [] }] },
    };
    expect(standardize(document, isbn).language).toBeUndefined();
  });
});

describe("getDescription", () => {
  it("should return string description", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValue({
        status: 200,
        data: { description: "A great story." },
      });
    expect(await getDescription("/works/OL1W")).toBe("A great story.");
  });

  it("should return description from object with value", async () => {
    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: { description: { type: "/type/text", value: "A great story." } },
    });
    expect(await getDescription("/works/OL1W")).toBe("A great story.");
  });

  it("should return empty string when description object has no value", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValue({ status: 200, data: { description: {} } });
    expect(await getDescription("/works/OL1W")).toBe("");
  });

  it("should return empty string when no description field", async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 200, data: {} });
    expect(await getDescription("/works/OL1W")).toBe("");
  });

  it("should return empty string when status is not 200", async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 404, data: {} });
    expect(await getDescription("/works/OL1W")).toBe("");
  });

  it("should return empty string when request throws", async () => {
    axios.get = jest.fn().mockRejectedValue(new Error("Network Error"));
    expect(await getDescription("/works/OL1W")).toBe("");
  });
});
