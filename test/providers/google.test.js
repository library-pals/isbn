import { resolveGoogle } from "../../src/providers/google.js";
import axios from "axios";
import { jest } from "@jest/globals";

jest.mock("axios");

describe("resolveGoogle", () => {
  const isbn = "1234567890";

  it("should resolve book information successfully", async () => {
    const mockResponse = {
      totalItems: 1,
      items: [
        {
          id: "11223344000",
          volumeInfo: {
            title: "Test Book",
            authors: ["Test Author"],
          },
        },
      ],
    };

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    const book = await resolveGoogle(isbn, {});
    expect(book).toMatchInlineSnapshot(`
{
  "authors": [
    "Test Author",
  ],
  "categories": undefined,
  "description": undefined,
  "isbn": "1234567890",
  "link": undefined,
  "pageCount": undefined,
  "printType": undefined,
  "thumbnail": "https://books.google.com/books?id=11223344000&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
  "title": "Test Book",
}
`);
  });

  it("should throw an error if no books are found", async () => {
    const mockResponse = {
      totalItems: 0,
    };

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    await expect(resolveGoogle(isbn, {})).rejects.toThrow(
      `No books found with isbn: ${isbn}`,
    );
  });

  it("should throw an error if status is not 200", async () => {
    const mockResponse = {
      totalItems: 1,
      items: [],
    };

    axios.get = jest.fn().mockResolvedValue({
      status: 404,
      data: mockResponse,
    });

    await expect(resolveGoogle(isbn, {})).rejects.toThrow(
      `Wrong response code: 404`,
    );
  });

  it("should throw an error if no volume info is found", async () => {
    const mockResponse = {
      totalItems: 1,
      items: [],
    };

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    await expect(resolveGoogle(isbn, {})).rejects.toThrow(
      `No volume info found for book with isbn: ${isbn}`,
    );
  });
});
