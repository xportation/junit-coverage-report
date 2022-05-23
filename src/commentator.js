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

  const { data: comments } = await octokit.rest.issues.listComments({
    repo,
    owner,
    issueNumber,
  });

  const comment = comments.find(
    (c) =>
      c.user.login === 'github-actions[bot]' && c.body.startsWith(WATERMARK)
  );

  if (comment) {
    core.info('Founded previous commit, updating');
    await octokit.rest.issues.updateComment({
      repo,
      owner,
      comment_id: comment.id,
      body: commentBody,
    });
  } else {
    core.info('No previous commit founded, creating a new one');
    await octokit.rest.issues.createComment({
      repo,
      owner,
      issueNumber,
      body: commentBody,
    });
  }
}

module.exports = { addPullRequestComment }
