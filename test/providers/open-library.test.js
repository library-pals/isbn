import {
  resolveOpenLibrary,
  getAuthors,
  getWorks,
} from "../../src/providers/open-library.js";
import axios from "axios";
import { jest } from "@jest/globals";

import openLibraryMock from "../fixtures/open-library-isbn-9780140328721.json";
import openLibraryWorksMock from "../fixtures/open-library-works-OL45804W.json";
import openLibraryAuthorsMock from "../fixtures/open-library-authors-OL34184A.json";

import openLibraryMock2 from "../fixtures/open-library-isbn-9781888363432.json";
import openLibraryWorksMock2 from "../fixtures/open-library-works-OL998749M.json";
import openLibraryAuthorsMock2 from "../fixtures/open-library-authors-OL29463A.json";

jest.mock("axios");

describe("resolveOpenLibrary", () => {
  const isbn = "9780374104092";

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
        "authors": [
          "Roald Dahl",
        ],
        "bookProvider": "Open Library",
        "categories": [
          "Animals",
          "Hunger",
          "Open Library Staff Picks",
          "Juvenile fiction",
          "Children's stories, English",
          "Foxes",
          "Fiction",
          "Zorros",
          "Ficción juvenil",
          "Tunnels",
          "Interviews",
          "Farmers",
          "Children's stories",
          "Rats",
          "Welsh Authors",
          "English Authors",
          "Thieves",
          "Tricksters",
          "Badgers",
          "Children's fiction",
          "Foxes, fiction",
          "Underground",
          "Renards",
          "Romans, nouvelles, etc. pour la jeunesse",
          "Children's literature",
          "Plays",
          "Children's plays",
          "Children's stories, Welsh",
          "Agriculteurs",
          "Fantasy fiction",
          "Children's plays, English",
        ],
        "description": "The main character of Fantastic Mr. Fox is an extremely clever anthropomorphized fox named Mr. Fox. He lives with his wife and four little foxes. In order to feed his family, he steals food from the cruel, brutish farmers named Boggis, Bunce, and Bean every night.

      Finally tired of being constantly outwitted by Mr. Fox, the farmers attempt to capture and kill him. The foxes escape in time by burrowing deep into the ground. The farmers decide to wait outside the hole for the foxes to emerge. Unable to leave the hole and steal food, Mr. Fox and his family begin to starve. Mr. Fox devises a plan to steal food from the farmers by tunneling into the ground and borrowing into the farmer's houses.

      Aided by a friendly Badger, the animals bring the stolen food back and Mrs. Fox prepares a great celebratory banquet attended by the other starving animals and their families. Mr. Fox invites all the animals to live with him underground and says that he will provide food for them daily thanks to his underground passages. All the animals live happily and safely, while the farmers remain waiting outside in vain for Mr. Fox to show up.",
        "format": "book",
        "isbn": "9780374104092",
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

  it("should resolve book information successfully when missing data", async () => {
    const mockResponse = {
      title: "Fantastic Mr. Fox",
      publish_date: "October 1, 1988",
      covers: [8_739_161],
      number_of_pages: 96,
      languages: [{ key: "/languages/made-up-language" }],
    };
    axios.get = jest.fn().mockImplementation((url) => {
      if (url.includes("/isbn")) {
        return Promise.resolve({ status: 200, data: mockResponse });
      }
    });

    const book = await resolveOpenLibrary(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [],
        "bookProvider": "Open Library",
        "categories": [],
        "description": "",
        "format": "book",
        "isbn": "9780374104092",
        "language": undefined,
        "link": "https://openlibrary.org/isbn/9780374104092",
        "pageCount": 96,
        "publishedDate": "October 1, 1988",
        "publisher": undefined,
        "thumbnail": "https://covers.openlibrary.org/b/id/8739161-L.jpg",
        "title": "Fantastic Mr. Fox",
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
      `No books found with ISBN: ${isbn}`,
    );
  });

  it("should throw an error if the response status is not 200", async () => {
    const mockResponse = {};

    axios.get = jest.fn().mockResolvedValue({
      status: 404,
      data: mockResponse,
    });

    await expect(resolveOpenLibrary(isbn, {})).rejects.toThrow(
      "Wrong response code: 404",
    );
  });
});

describe("getAuthors", () => {
  it("should return author names", async () => {
    const rawAuthors = [{ key: "/authors/OL1A" }, { key: "/authors/OL2A" }];

    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { name: "Author 1" },
    });
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { name: "Author 2" },
    });

    const authors = await getAuthors(rawAuthors);

    expect(authors).toEqual(["Author 1", "Author 2"]);
  });

  it("should return empty", async () => {
    const rawAuthors = [{ key: "/authors/OL1A" }];

    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {},
    });

    const authors = await getAuthors(rawAuthors);

    expect(authors).toEqual([]);
  });

  it("should throw an error when the response status is not 200", async () => {
    const rawAuthors = [{ key: "/authors/OL1A" }];

    axios.get.mockResolvedValueOnce({ status: 404 });

    await expect(getAuthors(rawAuthors)).rejects.toThrow(
      "Unable to get author /authors/OL1A: 404",
    );
  });
});

describe("getWorks", () => {
  it("should return works", async () => {
    const book = {
      works: [{ key: "/works/OL1A" }],
    };
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        description: "Description",
        subjects: ["subject"],
        authors: [
          {
            author: {
              key: "/authors/OL34184A",
            },
            type: {
              key: "/type/author_role",
            },
          },
        ],
      },
    });

    const works = await getWorks(book);

    expect(works).toEqual({
      description: "Description",
      rawAuthors: [{ key: "/authors/OL34184A" }],
      subjects: ["subject"],
    });
  });

  it("should return defaults", async () => {
    const book = {
      works: [{ key: "/works/OL1A" }],
    };
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        description: "Description",
      },
    });

    const works = await getWorks(book);

    expect(works).toEqual({
      description: "Description",
      rawAuthors: [],
      subjects: [],
    });
  });

  it("should return empty objects if missing key", async () => {
    const book = {
      works: [],
    };

    const works = await getWorks(book);

    expect(works).toEqual({
      description: "",
      rawAuthors: [],
      subjects: [],
    });
  });

  it("should throw an error when the response status is not 200", async () => {
    const works = [{ key: "/works/OL1A" }];

    axios.get.mockResolvedValueOnce({ status: 404 });

    await expect(getWorks({ works })).rejects.toThrow(
      "Unable to get /works/OL1A: 404",
    );
  });
});

describe("additional test cases", () => {
  const isbn = "9781888363432";

  it("should resolve book information successfully", async () => {
    const mockResponse = openLibraryMock2;

    axios.get = jest.fn().mockImplementation((url) => {
      if (url.includes("/isbn")) {
        return Promise.resolve({ status: 200, data: mockResponse });
      } else if (url.includes("/works")) {
        return Promise.resolve({
          status: 200,
          data: openLibraryWorksMock2,
        });
      } else if (url.includes("/authors")) {
        return Promise.resolve({
          status: 200,
          data: openLibraryAuthorsMock2,
        });
      }
    });

    const book = await resolveOpenLibrary(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [],
        "bookProvider": "Open Library",
        "categories": [],
        "description": "A work of fantasy, I Who Have Never Known Men is the haunting and unforgettable account of a near future on a barren earth where women are kept in underground cages guarded by uniformed groups of men. It is narrated by the youngest of the women, the only one with no memory of what the world was like before the cages, who must teach herself, without books or sexual contact, the essential human emotions of longing, loving, learning, companionship, and dying.",
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

  it("should resolve book information successfully, empty description", async () => {
    let mockResponse = openLibraryMock2;
    mockResponse.description = {
      type: "/type/text",
      value: undefined,
    };

    axios.get = jest.fn().mockImplementation((url) => {
      if (url.includes("/isbn")) {
        return Promise.resolve({ status: 200, data: mockResponse });
      } else if (url.includes("/works")) {
        return Promise.resolve({
          status: 200,
          data: openLibraryWorksMock2,
        });
      } else if (url.includes("/authors")) {
        return Promise.resolve({
          status: 200,
          data: openLibraryAuthorsMock2,
        });
      }
    });

    const book = await resolveOpenLibrary(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [],
        "bookProvider": "Open Library",
        "categories": [],
        "description": "A work of fantasy, I Who Have Never Known Men is the haunting and unforgettable account of a near future on a barren earth where women are kept in underground cages guarded by uniformed groups of men. It is narrated by the youngest of the women, the only one with no memory of what the world was like before the cages, who must teach herself, without books or sexual contact, the essential human emotions of longing, loving, learning, companionship, and dying.",
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
