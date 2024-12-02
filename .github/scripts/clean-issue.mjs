const { Octokit } = require("@octokit/rest");

const token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: token });

(async () => {
  const { GITHUB_REPOSITORY, GITHUB_EVENT_PATH } = process.env;
  const [owner, repo] = GITHUB_REPOSITORY.split("/");
  const eventData = require(GITHUB_EVENT_PATH);

  const issueNumber = eventData.issue.number;
  const issueBody = eventData.issue.body;

  // Eliminar secciones con '_No response_'
  const cleanedBody = issueBody.replace(/### .*?\n\n_No response_\n\n/g, "");

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
