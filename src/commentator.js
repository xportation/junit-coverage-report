const core = require('@actions/core');
const github = require('@actions/github');

const addPullRequestComment = async (githubToken, message) => {
  const { context } = github;
  const { repo, owner } = context.repo;
  const { payload } = context;
  const WATERMARK = `<!-- junit coverage report: ${context.job} -->\n`;
  const issueNumber = payload.pull_request ? payload.pull_request.number : 0;
  const commentBody = WATERMARK + message;

  const octokit = github.getOctokit(githubToken);

  const { data: comments } = await octokit.issues.listComments({
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
    await octokit.issues.updateComment({
      repo,
      owner,
      comment_id: comment.id,
      commentBody,
    });
  } else {
    core.info('No previous commit founded, creating a new one');
    await octokit.issues.createComment({
      repo,
      owner,
      issueNumber,
      commentBody,
    });
  }
}

module.exports = { addPullRequestComment }
