import { Octokit } from "@octokit/rest";
import fs from "fs";

const token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: token });

(async () => {
  const { GITHUB_REPOSITORY, GITHUB_EVENT_PATH } = process.env;
  const [owner, repo] = GITHUB_REPOSITORY.split("/");
  const eventData = JSON.parse(await fs.promises.readFile(GITHUB_EVENT_PATH, "utf-8"));

  const issueNumber = eventData.issue.number;
  const issueBody = eventData.issue.body;

  console.log('issueBody', issueBody)

  // Eliminar secciones con '_No response_'
  const cleanedBody = issueBody.replace(/### .*?\r?\n\r?\n_No response_\r?\n\r?\n/g, "");
  
  console.log('cleanedBody', cleanedBody)

  // Actualizar el issue si hay cambios
  if (cleanedBody !== issueBody) {
    await octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      body: cleanedBody,
    });
    console.log("Issue cleaned successfully.");
  } else {
    console.log("No changes required.");
  }
})();
