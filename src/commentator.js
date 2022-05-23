const core = require('@actions/core');
const github = require('@actions/github');

const addPullRequestComment = async (githubToken, message) => {
  const { context } = github;
  const { repo, owner } = context.repo;
  const { payload } = context;
  const WATERMARK = `<!-- junit coverage report: ${context.job} -->\n`;
  const issueNumber = payload.pull_request ? payload.pull_request.number : 0;
  const commentBody = WATERMARK + message;

  core.info('Add PR Comment');
  const octokit = github.getOctokit(githubToken);

  console.log("Listing comments");
  const { data: comments } = await octokit.issues.listComments({
    repo,
    owner,
    issueNumber,
  });

  console.log(`Comments count: ${comments.length}`);
  const comment = comments.find(
    (c) =>
      c.user.login === 'github-actions[bot]' && c.body.startsWith(WATERMARK)
  );

  if (comment) {
    core.info('Founded previous commit, updating');
    await octokit.issues.updateComment({
      repo,
      owner,
      comment_id: comment.id,
      body: commentBody,
    });
  } else {
    core.info('No previous commit founded, creating a new one');
    await octokit.issues.createComment({
      repo,
      owner,
      issueNumber,
      body: commentBody,
    });
  }
}

module.exports = { addPullRequestComment }
