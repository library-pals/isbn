#!/usr/bin/env node
import meow from "meow";
import isbn from "./index.js";

const cli = meow(
  `
  Usage
    $ isbn <input>

  Options
    --isbn, -i  The ISBN for the book

  Examples
    $ isbn 9780374104092

  This script will resolve the provided ISBN to a book. The ISBN must be a valid ISBN-10 or ISBN-13.
`,
  {
    importMeta: import.meta,
    flags: {
      isbn: {
        type: "string",
        shortFlag: "i",
        isRequired: true,
      },
    },
  }
);

if (!/^(\d{10}|\d{13})$/.test(cli.flags.isbn)) {
  console.error("Invalid ISBN. Please provide a valid ISBN-10 or ISBN-13.");
  process.exit(1);
}

try {
  const book = await isbn.resolve(cli.flags.isbn);
  console.log(book);
} catch (error) {
  console.error("An error occurred while trying to resolve the ISBN:", error);
  process.exit(1);
}
