import { readFile, writeFile } from "node:fs/promises";
import Isbn from "../../src/index.js";

/**
 * Updates examples in a markdown file by fetching book data using ISBN identifiers.
 * @returns {Promise<void>} A promise that resolves when the examples are updated.
 */
async function updateExamples() {
  const markdownFilePath = "./README.md";
  const readme = await readFile(markdownFilePath, "utf8");
  let updatedReadme = readme;

  // Use regex to match HTML comments
  const commentRegex = /<!--(.*?)-->/gs;
  let match;
  const comments = [];
  while ((match = commentRegex.exec(readme)) !== null) {
    comments.push(match[1].trim()); // trim here
  }

  await Promise.all(
    comments.map(async (comment) => {
      const isbn = new Isbn();
      const [provider, identifier] = comment.split(" ");
      try {
        isbn.provider([provider]);
        const book = await isbn.resolve(identifier);
        const markdown = "```json\n" + JSON.stringify(book, null, 2) + "\n```";

        // Replace the code block after the original comment
        updatedReadme = updatedReadme.replace(
          new RegExp(
            `(<!--\\s*${comment}\\s*-->)([\\s\\S]*?)(\`\`\`json[\\s\\S]*?\`\`\`)`,
          ),
          `$1\n\n${markdown}`,
        );
      } catch (error) {
        console.error(`Failed to fetch data for ${comment}:`, error);
      }
    }),
  );

  await writeFile(markdownFilePath, updatedReadme);
}

try {
  await updateExamples();
} catch (error) {
  console.log(error);
}
