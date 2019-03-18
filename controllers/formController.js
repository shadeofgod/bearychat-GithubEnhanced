const getProperty = require('lodash/get');
const debug = require('debug')('bearychat-githubenhanced:form controller');
const formBuilder = require('../utils/formBuilder');
const { createSection } = require('../utils/components');
const { hubotApi, githubApi } = require('../utils/request');
const userModel = require('../models/user');

const {
  HOST_API_BASEURL,
} = process.env;


class FormController {
  async createPayloadUrl(req, res) {
    if (
      getProperty(req, 'body.action') !== 'confirm_channel'
      || getProperty(req, 'body.data.target_channel.length') === 0
    ) {
      return res.status(400).send('参数错误');
    };

    const channel_id = req.body.data.target_channel[0];
    const { data: { vchannel_id, name } } = await hubotApi.get(`/channel.info`, {
      params: {
        channel_id,
      }
    });

    const vchannelId = Buffer.from(vchannel_id).toString('hex');
    const payloadUrl = `${HOST_API_BASEURL}/webhook/${vchannelId}`;

    debug('created payload url:', payloadUrl);

    hubotApi.post('/message.create', {
      vchannel_id: req.query.vchannel_id,
      text: `将此 url 填入到 github repo setting 中就可以在 **${name}** 频道收到推送啦：\n\`${payloadUrl}\`\n如果是私有频道还需要把我邀请加入频道哦`,
    });

    res.json({});
  }

  async handleCommentResponse(req, res) {
    const { user_id, team_id, owner, repo, number } = req.query;

    debug('owner:', owner);
    debug('repo:', repo);
    debug('number:', number);
    debug('user_id:', user_id);
    debug('team_id:', team_id);

    const nonAuthForm = formBuilder.create()
      .add(createSection(`This feature requires Github OAuth, [click here to authorize](${HOST_API_BASEURL}/github_oauth.request?user_id=${user_id}&team_id=${team_id}).`));

    let access_token;
    try {
      const results = await userModel.getAccessToken(user_id, team_id, req);

      if (results.length > 0) {
        access_token = results[0].token;
      } else {
        throw new Error();
      }
    } catch (e) {
      return res.json(nonAuthForm);
    }

    debug('access_token:', access_token);

    if (owner && repo && number && access_token) {
      try {
        const githubApiUrl = `/repos/${owner}/${repo}/issues/${number}/comments`;
        const githubApiPayload = {
          body: req.body.data.response,
        };

        githubApi.post(githubApiUrl, githubApiPayload, { params: { access_token } });

        return res.json({});
      } catch (e) {
        userModel.removeToken(user_id, team_id, req);
        return res.json(nonAuthForm);
      }
    }

    const emptyForm = formBuilder.create().getResult();
    return res.json(emptyForm);
  }
}

module.exports = new FormController();
