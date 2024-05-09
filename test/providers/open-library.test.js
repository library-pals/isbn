import { resolveOpenLibrary } from "../../src/providers/open-library.js";
import axios from "axios";
import { jest } from "@jest/globals";

jest.mock("axios");

describe("resolveOpenLibrary", () => {
  const isbn = "9780374104092";

  it("should resolve book information successfully", async () => {
    const mockResponse = {
      "ISBN:9780374104092": {
        url: "https://openlibrary.org/books/OL31444108M/Annihilation",
        key: "/books/OL31444108M",
        title: "Annihilation",
        authors: [
          {
            url: "https://openlibrary.org/authors/OL359235A/Jeff_VanderMeer",
            name: "Jeff VanderMeer",
          },
        ],
        number_of_pages: 208,
        weight: "5.6 ounces",
        identifiers: {
          isbn_13: ["9780374104092"],
          openlibrary: ["OL31444108M"],
        },
        publishers: [{ name: "Farrar, Straus and Giroux" }],
        publish_date: "2014",
        subjects: [
          {
            name: "Nebula Award Winner",
            url: "https://openlibrary.org/subjects/nebula_award_winner",
          },
          {
            name: "award:nebula_award=novel",
            url: "https://openlibrary.org/subjects/award:nebula_award=novel",
          },
          {
            name: "award:nebula_award=2015",
            url: "https://openlibrary.org/subjects/award:nebula_award=2015",
          },
          {
            name: "Discoveries in geography",
            url: "https://openlibrary.org/subjects/discoveries_in_geography",
          },
          { name: "Fiction", url: "https://openlibrary.org/subjects/fiction" },
          {
            name: "Scientists",
            url: "https://openlibrary.org/subjects/scientists",
          },
          {
            name: "Science-Fiction",
            url: "https://openlibrary.org/subjects/science-fiction",
          },
          {
            name: "Suspense fiction",
            url: "https://openlibrary.org/subjects/suspense_fiction",
          },
          {
            name: "Paranormal fiction",
            url: "https://openlibrary.org/subjects/paranormal_fiction",
          },
          {
            name: "Women scientists",
            url: "https://openlibrary.org/subjects/women_scientists",
          },
          {
            name: "Science fiction",
            url: "https://openlibrary.org/subjects/science_fiction",
          },
          {
            name: "Fantasy fiction",
            url: "https://openlibrary.org/subjects/fantasy_fiction",
          },
          {
            name: "Mystery fiction",
            url: "https://openlibrary.org/subjects/mystery_fiction",
          },
          {
            name: "Adventure fiction",
            url: "https://openlibrary.org/subjects/adventure_fiction",
          },
          {
            name: "Exploration",
            url: "https://openlibrary.org/subjects/exploration",
          },
          {
            name: "Amerikanisches Englisch",
            url: "https://openlibrary.org/subjects/amerikanisches_englisch",
          },
          {
            name: "Fiction, science fiction, action & adventure",
            url: "https://openlibrary.org/subjects/fiction,_science_fiction,_action_&_adventure",
          },
          {
            name: "Fiction, suspense",
            url: "https://openlibrary.org/subjects/fiction,_suspense",
          },
          {
            name: "Action & Adventure",
            url: "https://openlibrary.org/subjects/action_&_adventure",
          },
          {
            name: "Dystopian",
            url: "https://openlibrary.org/subjects/dystopian",
          },
          { name: "Fantasy", url: "https://openlibrary.org/subjects/fantasy" },
          {
            name: "Extrasensory perception",
            url: "https://openlibrary.org/subjects/extrasensory_perception",
          },
          {
            name: "Literary",
            url: "https://openlibrary.org/subjects/literary",
          },
          {
            name: "Suspense",
            url: "https://openlibrary.org/subjects/suspense",
          },
          {
            name: "Thrillers",
            url: "https://openlibrary.org/subjects/thrillers",
          },
          { name: "General", url: "https://openlibrary.org/subjects/general" },
          {
            name: "Pollution",
            url: "https://openlibrary.org/subjects/pollution",
          },
          { name: "horror", url: "https://openlibrary.org/subjects/horror" },
          {
            name: "body horror",
            url: "https://openlibrary.org/subjects/body_horror",
          },
          {
            name: "alien invasion",
            url: "https://openlibrary.org/subjects/alien_invasion",
          },
          {
            name: "nyt:trade-fiction-paperback=2018-03-18",
            url: "https://openlibrary.org/subjects/nyt:trade-fiction-paperback=2018-03-18",
          },
          {
            name: "New York Times bestseller",
            url: "https://openlibrary.org/subjects/new_york_times_bestseller",
          },
          {
            name: "Explorers",
            url: "https://openlibrary.org/subjects/explorers",
          },
          { name: "Secrecy", url: "https://openlibrary.org/subjects/secrecy" },
          {
            name: "Scientific expeditions",
            url: "https://openlibrary.org/subjects/scientific_expeditions",
          },
          {
            name: "Psychic ability",
            url: "https://openlibrary.org/subjects/psychic_ability",
          },
          {
            name: "Fiction, thrillers, suspense",
            url: "https://openlibrary.org/subjects/fiction,_thrillers,_suspense",
          },
          {
            name: "Discoveries in geography--fiction",
            url: "https://openlibrary.org/subjects/discoveries_in_geography--fiction",
          },
          {
            name: "Scientists--fiction",
            url: "https://openlibrary.org/subjects/scientists--fiction",
          },
          {
            name: "Women scientists--fiction",
            url: "https://openlibrary.org/subjects/women_scientists--fiction",
          },
          {
            name: "Ps3572.a4284 a84 2014",
            url: "https://openlibrary.org/subjects/ps3572.a4284_a84_2014",
          },
          { name: "813/.54", url: "https://openlibrary.org/subjects/813/.54" },
        ],
        excerpts: [
          {
            text: "The tower, which was not supposed to be there, plunges into the earth in a place just before the black pine forest begins to give way to swamp and then the reeds and wind-gnarled trees of the marsh flats. Beyond the marsh flats and the natural canals lies the ocean and, a little farther down the coast, a derelict lighthouse. All of this part of the country had been abandoned for decades, for reasons that are not easy to relate. Our expedition was the first to enter Area X for more than two years, and much of our predecessors' equipment had rusted, their tents and sheds little more than husks. Looking out over that untroubled landscape, I do not believe any of us could yet see the threat. There were four of us: a biologist, an anthropologist, a surveyor, and a psychologist. I was the biologist. All of us were women this time, chosen as part of the complex set of variables that governed sending the expeditions. The psychologist, who was older than the rest of us, served as the expedition's leader. She had put us all under hypnosis to cross the border, to make sure we remained calm. It took four days of hard hiking after crossing the border to reach the coast. Our mission was simple: to continue the government's investigation into the mysteries of Area X.",
            comment: "",
          },
        ],
        cover: {
          small: "https://covers.openlibrary.org/b/id/10520611-S.jpg",
          medium: "https://covers.openlibrary.org/b/id/10520611-M.jpg",
          large: "https://covers.openlibrary.org/b/id/10520611-L.jpg",
        },
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
    "Jeff VanderMeer",
  ],
  "categories": [
    "Nebula Award Winner",
    "award:nebula_award=novel",
    "award:nebula_award=2015",
    "Discoveries in geography",
    "Fiction",
    "Scientists",
    "Science-Fiction",
    "Suspense fiction",
    "Paranormal fiction",
    "Women scientists",
    "Science fiction",
    "Fantasy fiction",
    "Mystery fiction",
    "Adventure fiction",
    "Exploration",
    "Amerikanisches Englisch",
    "Fiction, science fiction, action & adventure",
    "Fiction, suspense",
    "Action & Adventure",
    "Dystopian",
    "Fantasy",
    "Extrasensory perception",
    "Literary",
    "Suspense",
    "Thrillers",
    "General",
    "Pollution",
    "horror",
    "body horror",
    "alien invasion",
    "nyt:trade-fiction-paperback=2018-03-18",
    "New York Times bestseller",
    "Explorers",
    "Secrecy",
    "Scientific expeditions",
    "Psychic ability",
    "Fiction, thrillers, suspense",
    "Discoveries in geography--fiction",
    "Scientists--fiction",
    "Women scientists--fiction",
    "Ps3572.a4284 a84 2014",
    "813/.54",
  ],
  "description": undefined,
  "link": "https://openlibrary.org/books/OL31444108M/Annihilation",
  "pageCount": 208,
  "printType": "BOOK",
  "publishedDate": "2014",
  "publisher": "Farrar, Straus and Giroux",
  "thumbnail": "https://covers.openlibrary.org/b/id/10520611-L.jpg",
  "title": "Annihilation",
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
});
