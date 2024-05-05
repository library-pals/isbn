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
    expect(book).toEqual({
      authors: ["Test Author"],
      categories: [],
      description: "Test subtitle",
      imageLinks: {
        smallThumbnail: "http://example.com/test.jpg",
        thumbnail: "http://example.com/test.jpg",
      },
      industryIdentifiers: [],
      infoLink: "http://example.com/info",
      language: "en",
      pageCount: 123,
      previewLink: "http://example.com/preview",
      printType: "BOOK",
      publishedDate: "2022-01-01",
      publisher: "Test Publisher",
      title: "Test Book",
    });
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

    const expectedStandardBook = {
      title: "Test Book",
      publishedDate: "2022",
      authors: ["Test Author"],
      description: "Test Subtitle",
      industryIdentifiers: [],
      pageCount: 200,
      printType: "BOOK",
      categories: [],
      imageLinks: {
        smallThumbnail: "http://example.com/thumbnail.jpg",
        thumbnail: "http://example.com/thumbnail.jpg",
      },
      previewLink: "http://example.com/preview",
      infoLink: "http://example.com/info",
      publisher: "Test Publisher",
      language: "unknown",
    };

    expect(standardize(book)).toEqual(expectedStandardBook);
  });

  it("should handle unknown language", () => {
    const book = {
      details: {
        title: "Test Book",
        publish_date: "2022",
        subtitle: "Test Subtitle",
        number_of_pages: 200,
        languages: [{ key: "/languages/unknown" }],
      },
      thumbnail_url: "http://example.com/thumbnail.jpg",
      preview_url: "http://example.com/preview",
      info_url: "http://example.com/info",
    };

    const expectedStandardBook = {
      title: "Test Book",
      publishedDate: "2022",
      authors: [],
      description: "Test Subtitle",
      industryIdentifiers: [],
      pageCount: 200,
      printType: "BOOK",
      categories: [],
      imageLinks: {
        smallThumbnail: "http://example.com/thumbnail.jpg",
        thumbnail: "http://example.com/thumbnail.jpg",
      },
      previewLink: "http://example.com/preview",
      infoLink: "http://example.com/info",
      publisher: "",
      language: "unknown",
    };

    expect(standardize(book)).toEqual(expectedStandardBook);
  });
});
