import { resolveLibroFm, standardize } from "../../src/providers/librofm.js";
import axios from "axios";
import { jest } from "@jest/globals";
import { readFile } from "node:fs/promises";

jest.mock("axios");

describe("librofm", () => {
  describe("resolveLibroFm", () => {
    it("works", async () => {
      const mockResponse = await readFile(
        "./test/fixtures/librofm-9781797176888.html",
        "utf8",
      );
      axios.get = jest.fn().mockResolvedValue({
        status: 200,
        data: mockResponse,
      });
      const book = await resolveLibroFm("9781797176888");
      expect(book).toMatchInlineSnapshot(`
        {
          "authors": [
            "Kaliane Bradley",
          ],
          "bookProvider": "Libro.fm",
          "categories": [],
          "description": "<b><i>NEW YORK TIMES</i></b><b> BESTSELLER</b><br> <b>A GOOD MORNING AMERICA BOOK CLUB PICK</b><br> <br><b>“This summer’s hottest debut.” —<i>Cosmopolitan </i>• “Witty, sexy escapist fiction [that] packs a substantial punch...It’s a smart, gripping work that’s also a feast for the senses...Fresh and thrilling.” —<i>Los Angeles Times </i>• “Electric...I loved every second.” —Emily Henry</b><br> <br><b>“Utterly winning...Imagine if <i>The Time Traveler’s Wife </i>had an affair with <i>A Gentleman in Moscow</i>...Readers, I envy you: There’s a smart, witty novel in your future.” —Ron Charles, <i>The Washington Post</i></b><br> <br><b>A time travel romance, a spy thriller, a workplace comedy, and an ingenious exploration of the nature of power and the potential for love to change it all: Welcome to <i>The Ministry of Time</i>, the exhilarating debut novel by Kaliane Bradley.</b><br><br>In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time.<br> <br>She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts.<br> <br>Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future.<br> <br>An exquisitely original and feverishly fun fusion of genres and ideas, <i>The Ministry of Time </i>asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world.",
          "isbn": "9781797176888",
          "language": "en",
          "link": "https://libro.fm/audiobooks/9781797176888",
          "printType": "AudiobookFormat",
          "publishedDate": "2024-05-07",
          "publisher": "Simon & Schuster Audio",
          "thumbnail": "https://covers.libro.fm/9781797176888_1120.jpg",
          "title": "The Ministry of Time",
        }
      `);
    });

    it("should throw an error if the response status is not 200", async () => {
      const mockResponse = {};

      axios.get = jest.fn().mockResolvedValue({
        status: 404,
        data: mockResponse,
      });

      await expect(resolveLibroFm("1234567890", {})).rejects.toThrow(
        `Unable to get https://libro.fm/audiobooks/1234567890: 404`,
      );
    });

    it("should throw an error if no information is found for the ISBN", async () => {
      axios.get = jest.fn().mockResolvedValue({
        status: 200,
        data: "<html></html>",
      });
      await expect(resolveLibroFm("1234567890")).rejects.toThrow(
        "No information found for https://libro.fm/audiobooks/1234567890",
      );
    });
  });

  // Add more tests here for different scenarios
});

describe("standardize", () => {
  it("should standardize a book object", async () => {
    const book = {
      url: "http://example.com",
      bookFormat: "Audiobook",
      name: "Example Book",
      description: "This is an example book.",
      isbn: "1234567890",
      image: "http://example.com/image.jpg",
      abridged: "No",
      author: [{ name: "Author Name" }],
      readBy: [{ name: "Reader Name" }],
      publisher: "Example Publisher",
      datePublished: "2022-01-01",
      inLanguage: "English",
      duration: "1h",
      regionsAllowed: ["US"],
      offers: {},
      workExample: {},
    };

    const standardizedBook = await standardize(book, "1234567890");

    expect(standardizedBook).toEqual({
      title: "Example Book",
      authors: ["Author Name"],
      description: "This is an example book.",
      printType: "Audiobook",
      categories: [],
      thumbnail: "http://example.com/image.jpg",
      link: "http://example.com",
      publisher: "Example Publisher",
      publishedDate: "2022-01-01",
      language: "English",
      isbn: "1234567890",
      bookProvider: "Libro.fm",
    });
  });
});
