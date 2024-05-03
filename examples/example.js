import isbn from "../src/index.js";

const input = process.argv.slice(2)[0] || "9780374104092";

// Set the providers you want to use
isbn.provider(["openlibrary", "worldcat"]);

// Get book info using the providers
try {
  const book = await isbn.resolve(input);
  console.log("Book isbn:" + input + " found %j", book);
} catch (error) {
  console.log("Book isbn:" + input + " not found", error);
}
