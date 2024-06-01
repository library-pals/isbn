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
        "utf8"
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
          "categories": [
            "Fiction",
            "Romance",
            "Science Fiction",
            "Fiction - Literary",
          ],
          "description": "In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time. She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts. Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future. An exquisitely original and feverishly fun fusion of genres and ideas, The Ministry of Time asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world.",
          "isbn": "9781797176888",
          "language": "en",
          "link": "https://libro.fm/audiobooks/9781797176888",
          "printType": "audiobook",
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
        `Unable to get https://libro.fm/audiobooks/1234567890: 404`
      );
    });

    it("should throw an error if no information is found for the ISBN", async () => {
      axios.get = jest.fn().mockResolvedValue({
        status: 200,
        data: "<html></html>",
      });
      await expect(resolveLibroFm("1234567890")).rejects.toThrow(
        "No information found for https://libro.fm/audiobooks/1234567890"
      );
    });
  });

  // Add more tests here for different scenarios
});

describe("standardize", () => {
  it("should standardize a book object", async () => {
    const data = `
    <div class="audiobook-genres">
                    <a href="/genres/fiction-literature">Fiction</a><a href="/genres/romance">Romance</a><a href="/genres/science-fiction">Science Fiction</a><a href="/genres/literary-fiction">Fiction - Literary</a>
                  </div>
    <script type="application/ld+json">
{
  "bookFormat": "AudiobookFormat",
  "name": "The Ministry of Time",
  "description": "Description",
  "isbn": "9781797176888",
  "image": "https://covers.libro.fm/9781797176888_1120.jpg",
  "abridged": "false",
  "author": [
    {
      "@type": "Person",
      "name": "Kaliane Bradley"
    }
  ],
  "readBy": [
    {
      "@type": "Person",
      "name": "George Weightman"
    },
    {
      "@type": "Person",
      "name": "Katie Leung"
    }
  ],
  "publisher": "Simon & Schuster Audio",
  "datePublished": "2024-05-07",
  "inLanguage": "en",
  "duration": "PT10H22M45S"
}
</script>
`;

    const standardizedBook = await standardize(
      data,
      "1234567890",
      "http://example.com"
    );

    expect(standardizedBook).toMatchInlineSnapshot(`
      {
        "authors": [
          "Kaliane Bradley",
        ],
        "bookProvider": "Libro.fm",
        "categories": [
          "Fiction",
          "Romance",
          "Science Fiction",
          "Fiction - Literary",
        ],
        "description": "Description",
        "isbn": "1234567890",
        "language": "en",
        "link": undefined,
        "printType": "audiobook",
        "publishedDate": "2024-05-07",
        "publisher": "Simon & Schuster Audio",
        "thumbnail": "https://covers.libro.fm/9781797176888_1120.jpg",
        "title": "The Ministry of Time",
      }
    `);
  });

  it("should standardize a book object with missing properties", async () => {
    const data = `
    <script type="application/ld+json">
{
  "bookFormat": "Another format",
  "name": "The Ministry of Time",
  "description": "",
  "isbn": "9781797176888",
  "image": "https://covers.libro.fm/9781797176888_1120.jpg",
  "abridged": "false",
  "author": [
    {
      "@type": "Person",
      "name": "Kaliane Bradley"
    }
  ],
  "publisher": "Simon & Schuster Audio",
  "datePublished": "2024-05-07",
  "inLanguage": "en",
  "duration": "PT10H22M45S"
}
</script>
`;

    const standardizedBook = await standardize(data, "1234567890", "");

    expect(standardizedBook).toMatchInlineSnapshot(`
      {
        "authors": [
          "Kaliane Bradley",
        ],
        "bookProvider": "Libro.fm",
        "categories": [],
        "description": "",
        "isbn": "1234567890",
        "language": "en",
        "link": undefined,
        "printType": "Another format",
        "publishedDate": "2024-05-07",
        "publisher": "Simon & Schuster Audio",
        "thumbnail": "https://covers.libro.fm/9781797176888_1120.jpg",
        "title": "The Ministry of Time",
      }
    `);
  });
});
