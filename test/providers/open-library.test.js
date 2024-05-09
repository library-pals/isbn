import {
  resolveOpenLibrary,
  standardize,
} from "../../src/providers/open-library.js";
import axios from "axios";
import { jest } from "@jest/globals";

jest.mock("axios");

describe("resolveOpenLibrary", () => {
  const isbn = "1234567890";

  it("should resolve book information successfully", async () => {
    const mockResponse = {
      [`ISBN:${isbn}`]: {
        details: {
          title: "Test Book",
          publish_date: "2022-01-01",
          authors: [{ name: "Test Author" }],
          subtitle: "Test subtitle",
          number_of_pages: 123,
          publishers: ["Test Publisher"],
          languages: [{ key: "/languages/eng" }],
        },
        thumbnail_url: "http://example.com/test.jpg",
        preview_url: "http://example.com/preview",
        info_url: "http://example.com/info",
      },
    };

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    const book = await resolveOpenLibrary(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [
          "Test Author",
        ],
        "categories": [],
        "description": "Test subtitle",
        "industryIdentifiers": [],
        "link": "http://example.com/info",
        "pageCount": 123,
        "printType": "BOOK",
        "publishedDate": "2022-01-01",
        "publisher": "Test Publisher",
        "thumbnail": "http://example.com/test.jpg",
        "title": "Test Book",
      }
    `);
  });

  it("should throw an error if no books are found", async () => {
    const mockResponse = {};

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    await expect(resolveOpenLibrary(isbn, {})).rejects.toThrow(
      `No books found with ISBN: ${isbn}`
    );
  });

  it("should throw an error if the response status is not 200", async () => {
    const mockResponse = {};

    axios.get = jest.fn().mockResolvedValue({
      status: 404,
      data: mockResponse,
    });

    await expect(resolveOpenLibrary(isbn, {})).rejects.toThrow(
      "Wrong response code: 404"
    );
  });

  it("should standardize a book object", () => {
    const book = {
      details: {
        title: "Test Book",
        publish_date: "2022",
        authors: [{ name: "Test Author" }],
        subtitle: "Test Subtitle",
        number_of_pages: 200,
        publishers: ["Test Publisher"],
      },
      thumbnail_url: "http://example.com/thumbnail.jpg",
      preview_url: "http://example.com/preview",
      info_url: "http://example.com/info",
    };

    expect(standardize(book)).toMatchInlineSnapshot(`
      {
        "authors": [
          "Test Author",
        ],
        "categories": [],
        "description": "Test Subtitle",
        "industryIdentifiers": [],
        "link": "http://example.com/info",
        "pageCount": 200,
        "printType": "BOOK",
        "publishedDate": "2022",
        "publisher": "Test Publisher",
        "thumbnail": "http://example.com/thumbnail.jpg",
        "title": "Test Book",
      }
    `);
  });
});
