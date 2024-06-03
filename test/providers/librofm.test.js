import {
  resolveLibroFm,
  standardize,
  formatDescription,
} from "../../src/providers/librofm.js";
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
          "categories": [
            "Fiction",
            "Romance",
            "Science Fiction",
            "Fiction - Literary",
          ],
          "description": "In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time. She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts. Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future. An exquisitely original and feverishly fun fusion of genres and ideas, The Ministry of Time asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world.",
          "format": "audiobook",
          "isbn": "9781797176888",
          "language": "en",
          "link": "https://libro.fm/audiobooks/9781797176888",
          "publishedDate": "2024-05-07",
          "publisher": "Simon & Schuster Audio",
          "thumbnail": "https://covers.libro.fm/9781797176888_1120.jpg",
          "title": "The Ministry of Time",
        }
      `);
    });

    it("works another sample", async () => {
      const mockResponse = await readFile(
        "./test/fixtures/librofm-9781250752864.html",
        "utf8",
      );
      axios.get = jest.fn().mockResolvedValue({
        status: 200,
        data: mockResponse,
      });
      const book = await resolveLibroFm("9781250752864");
      expect(book).toMatchInlineSnapshot(`
        {
          "authors": [
            "Raven Leilani",
          ],
          "bookProvider": "Libro.fm",
          "categories": [
            "Fiction",
            "Fiction - Literary",
          ],
          "description": "No one wants what no one wants. And how do we even know what we want? How do we know we’re ready to take it? Edie is stumbling her way through her twenties—sharing a subpar apartment in Bushwick, clocking in and out of her admin job, making a series of inappropriate sexual choices. She is also haltingly, fitfully giving heat and air to the art that simmers inside her. And then she meets Eric, a digital archivist with a family in New Jersey, including an autopsist wife who has agreed to an open marriage—with rules. As if navigating the constantly shifting landscapes of contemporary sexual manners and racial politics weren’t hard enough, Edie finds herself unemployed and invited into Eric’s home—though not by Eric. She becomes a hesitant ally to his wife and a de facto role model to his adopted daughter. Edie may be the only Black woman young Akila knows. Irresistibly unruly and strikingly beautiful, razor-sharp and slyly comic, sexually charged and utterly absorbing, Raven Leilani’s Luster is a portrait of a young woman trying to make sense of her life—her hunger, her anger—in a tumultuous era. It is also a haunting, aching description of how hard it is to believe in your own talent, and the unexpected influences that bring us into ourselves along the way. "Ariel Blake narrates, expertly inhabiting Edie’s knowing and analytical tone, and revelling in the writer’s winding sentences and caustic one-liners." “Exacting, hilarious, and deadly . . . A writer of exhilarating freedom and daring.” —Zadie Smith, Harper’s Bazaar "So delicious that it feels illicit . . . Raven Leilani’s first novel reads like summer: sentences like ice that crackle or melt into a languorous drip; plot suddenly, wildly flying forward like a bike down a hill." —Jazmine Hughes, The New York Times Book Review “An irreverent intergenerational tale of race and class that’s blisteringly smart and fan-yourself sexy.” —Michelle Hart, O: The Oprah Magazine",
          "format": "audiobook",
          "isbn": "9781250752864",
          "language": "en",
          "link": "https://libro.fm/audiobooks/9781250752864",
          "publishedDate": "2020-08-04",
          "publisher": "Macmillan Audio",
          "thumbnail": "https://covers.libro.fm/9781250752864_1120.jpg",
          "title": "Luster",
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
      "http://example.com",
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
        "format": "audiobook",
        "isbn": "1234567890",
        "language": "en",
        "link": undefined,
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
        "format": "Another format",
        "isbn": "1234567890",
        "language": "en",
        "link": undefined,
        "publishedDate": "2024-05-07",
        "publisher": "Simon & Schuster Audio",
        "thumbnail": "https://covers.libro.fm/9781797176888_1120.jpg",
        "title": "The Ministry of Time",
      }
    `);
  });
});

describe("formatDescription", () => {
  it("should format the description", () => {
    const description =
      '<p><b>"There is a universal appeal to [Narrator Ariel] Blake\'s performance as Edie, a protagonist who may be her own worst antagonist. Blake\'s delivery has an immensely human, relatable quality that makes the listener want the best for Edie as she struggles to make her way in the world." -- <i>AudioFile Magazine,</i> Earphones Award winner <br><br></b><b>AN INSTANT <i>NEW YORK TIMES</i> BESTSELLER</b><br><b>A <i>NEW YORK TIMES </i>NOTABLE BOOK OF 2020</b><br><b>NATIONAL INDIE BESTSELLER</b><br><b><i>LOS ANGELES TIMES</i> BESTSELLER</b><br><b><i>WASHINGTON POST </i>BESTSELLER</b><br><br><i>No one wants what no one wants.</i><br>And how do we even know what we want? How do we know we’re ready to take it?<br><br>Edie is stumbling her way through her twenties<b>—</b>sharing a subpar apartment in Bushwick, clocking in and out of her admin job, making a series of inappropriate sexual choices. She is also haltingly, fitfully giving heat and air to the art that simmers inside her. And then she meets Eric, a digital archivist with a family in New Jersey, including an autopsist wife who has agreed to an open marriage<b>—</b>with <i>rules</i>.<br><br>As if navigating the constantly shifting landscapes of contemporary sexual manners and racial politics weren’t hard enough, Edie finds herself unemployed and invited into Eric’s home—though not by Eric. She becomes a hesitant ally to his wife and a de facto role model to his adopted daughter. Edie may be the only Black woman young Akila knows.<br><br>Irresistibly unruly and strikingly beautiful, razor-sharp and slyly comic, sexually charged and utterly absorbing, Raven Leilani’s <i>Luster </i>is a portrait of a young woman trying to make sense of her life—her hunger, her anger—in a tumultuous era. It is also a haunting, aching description of how hard it is to believe in your own talent, and the unexpected influences that bring us into ourselves along the way.<br><br><b>A Macmillan Audio production from Farrar, Straus and Giroux</b><br><br>"Ariel Blake narrates, expertly inhabiting Edie’s knowing and analytical tone, and revelling in the writer’s winding sentences and caustic one-liners." <b>--<i>The Guardian</i></b><br><br>“Exacting, hilarious, and deadly . . . A writer of exhilarating freedom and daring.” —Zadie Smith, <i>Harper’s Bazaar</i><br><br>"So delicious that it feels illicit . . . Raven Leilani’s first novel reads like summer: sentences like ice that crackle or melt into a languorous drip; plot suddenly, wildly flying forward like a bike down a hill." —Jazmine Hughes, <i>The New York Times Book Review</i><br><br>“An irreverent intergenerational tale of race and class that’s blisteringly smart and fan-yourself sexy.” —Michelle Hart<i>, O: The Oprah Magazine</i></p>';
    const formattedDescription = formatDescription(description);
    expect(formattedDescription).toMatchInlineSnapshot(
      `"No one wants what no one wants. And how do we even know what we want? How do we know we’re ready to take it? Edie is stumbling her way through her twenties—sharing a subpar apartment in Bushwick, clocking in and out of her admin job, making a series of inappropriate sexual choices. She is also haltingly, fitfully giving heat and air to the art that simmers inside her. And then she meets Eric, a digital archivist with a family in New Jersey, including an autopsist wife who has agreed to an open marriage—with rules. As if navigating the constantly shifting landscapes of contemporary sexual manners and racial politics weren’t hard enough, Edie finds herself unemployed and invited into Eric’s home—though not by Eric. She becomes a hesitant ally to his wife and a de facto role model to his adopted daughter. Edie may be the only Black woman young Akila knows. Irresistibly unruly and strikingly beautiful, razor-sharp and slyly comic, sexually charged and utterly absorbing, Raven Leilani’s Luster is a portrait of a young woman trying to make sense of her life—her hunger, her anger—in a tumultuous era. It is also a haunting, aching description of how hard it is to believe in your own talent, and the unexpected influences that bring us into ourselves along the way. "Ariel Blake narrates, expertly inhabiting Edie’s knowing and analytical tone, and revelling in the writer’s winding sentences and caustic one-liners." “Exacting, hilarious, and deadly . . . A writer of exhilarating freedom and daring.” —Zadie Smith, Harper’s Bazaar "So delicious that it feels illicit . . . Raven Leilani’s first novel reads like summer: sentences like ice that crackle or melt into a languorous drip; plot suddenly, wildly flying forward like a bike down a hill." —Jazmine Hughes, The New York Times Book Review “An irreverent intergenerational tale of race and class that’s blisteringly smart and fan-yourself sexy.” —Michelle Hart, O: The Oprah Magazine"`,
    );
  });
});
