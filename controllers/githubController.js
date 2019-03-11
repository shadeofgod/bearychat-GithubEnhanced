const userModel = require('../models/user');
const { githubApi } = require('../utils/request');
const debug = require('debug')('bearychat-githubenhanced:github controller');

const {
  HOST_API_BASEURL,
  GITHUB_OAUTH_URL,
  GITHUB_APP_CLIENT_ID,
  GITHUB_APP_CLIENT_SECRET,
  GITHUB_OAUTH_TOKEN_URL,
} = process.env;

class GithubController {
  createGithubAuth(req, res) {
    const { user_id, team_id } = req.query;
    if (!user_id || !team_id) return res.sendStatus(400);

    const redirectUrl = `${HOST_API_BASEURL}/github_oauth.accept/${team_id}/${user_id}`;
    debug(redirectUrl);
    const targetUrl = `${GITHUB_OAUTH_URL}?client_id=${GITHUB_APP_CLIENT_ID}&redirect_uri=${redirectUrl}&scope=repo`;

    res.redirect(302, targetUrl);
  }

  async saveGithubAuth(req, res) {
    const { user_id, team_id } = req.params;
    const { code } = req.query;

    debug('code', code)
    debug('user_id', user_id)
    debug('team_id', team_id)

    const { data: { access_token } } = await githubApi.post(GITHUB_OAUTH_TOKEN_URL, {
      client_id: GITHUB_APP_CLIENT_ID,
      client_secret: GITHUB_APP_CLIENT_SECRET,
      code,
    }, { headers: { Accept: 'application/json' } });

    debug('access_token', access_token);

    userModel.saveToken(user_id, team_id, access_token, req);

    res.redirect(302, '/auth_success');
  }
}

module.exports = new GithubController();
