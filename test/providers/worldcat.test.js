import { resolveWorldcat, standardize } from "../../src/providers/worldcat.js";
import axios from "axios";
import { jest } from "@jest/globals";

jest.mock("axios");

describe("resolveWorldcat", () => {
  const isbn = "1234567890";

  it("should resolve book information successfully", async () => {
    const mockResponse = {
      stat: "ok",
      list: [
        {
          title: "Test Book",
          year: "2022",
          author: "Test Author",
          publisher: "Test Publisher",
          lang: "eng",
        },
      ],
    };

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    const book = await resolveWorldcat(isbn, {});
    expect(book).toEqual({
      authors: ["Test Author"],
      categories: [],
      description: null,
      imageLinks: {},
      industryIdentifiers: [],
      language: "en",
      pageCount: null,
      printType: "BOOK",
      publishedDate: "2022",
      publisher: "Test Publisher",
      title: "Test Book",
    });
  });

  it("should throw an error if no books are found", async () => {
    const mockResponse = {
      stat: "notfound",
      list: [],
    };

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    await expect(resolveWorldcat(isbn, {})).rejects.toThrow(
      `No books found with ISBN: ${isbn}`
    );
  });

  it("should throw an error if the response status is not 200", async () => {
    const mockResponse = {};

    axios.get = jest.fn().mockResolvedValue({
      status: 404,
      data: mockResponse,
    });

    await expect(resolveWorldcat(isbn, {})).rejects.toThrow(
      "Wrong response code: 404"
    );
  });

  it("should standardize a book object", () => {
    const book = {
      title: "Test Book",
      year: "2022",
      publisher: "Test Publisher",
      lang: "eng",
    };

    const expectedStandardBook = {
      title: "Test Book",
      publishedDate: "2022",
      authors: [],
      description: null,
      industryIdentifiers: [],
      pageCount: null,
      printType: "BOOK",
      categories: [],
      imageLinks: {},
      publisher: "Test Publisher",
      language: "en",
    };

    expect(standardize(book)).toEqual(expectedStandardBook);
  });

  it("should handle unknown language", () => {
    const book = {
      title: "Test Book",
      year: "2022",
      author: "Test Author",
      publisher: "Test Publisher",
      lang: "unknown",
    };

    const expectedStandardBook = {
      title: "Test Book",
      publishedDate: "2022",
      authors: ["Test Author"],
      description: null,
      industryIdentifiers: [],
      pageCount: null,
      printType: "BOOK",
      categories: [],
      imageLinks: {},
      publisher: "Test Publisher",
      language: "unknown",
    };

    expect(standardize(book)).toEqual(expectedStandardBook);
  });
});
