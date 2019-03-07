const getProperty = require('lodash/get');
const debug = require('debug')('bearychat-githubenhanced:form controller');
const formBuilder = require('../utils/formBuilder');
const {
  createSection,
  createChannelSelect,
  createSubmit,
  createInput,
  createMemberSelect,
} = require('../utils/components');
const { hubotApi, githubApi } = require('../utils/request');
const userModel = require('../models/user');

const {
  HOST_API_BASEURL,
} = process.env;


class FormController {
  createSelectChannelForm(req, res) {
    const selectChannelForm = formBuilder
      .create()
      .add(createChannelSelect('target_channel', {
        placeholder: 'Select a channel',
        label: '请选择推送要发送到的讨论组：',
      }))
      .add(createMemberSelect('target_member', {
        placeholder: 'Select a member',
        label: '请选择推送要发送到的成员：',
      }))
      .add(createSubmit('confirm_channel', '确定'))
      .getResult();

    res.json(selectChannelForm);
  }

  async createPayloadUrl(req, res) {
    if (
      getProperty(req, 'body.action') !== 'confirm_channel'
      || getProperty(req, 'body.data.target_channel.length') === 0
    ) {
      return res.status(400).send('参数错误');
    };

    const channel_id = req.body.data.target_channel[0];
    const { data: { vchannel_id } } = await hubotApi.get(`/channel.info`, {
      params: {
        channel_id,
      }
    });

    const vchannelId = Buffer.from(vchannel_id).toString('hex');
    const payloadUrl = `${HOST_API_BASEURL}/webhook/${vchannelId}`;

    debug('created payload url:', payloadUrl);

    const emptyForm = formBuilder
      .create()
      .getResult();

    hubotApi.patch('/message.update_text', {
      vchannel_id: req.query.vchannel_id,
      message_key: req.query.message_key,
      text: `请将 payload url 填入 github repo setting 中：\n\`${payloadUrl}\``,
      form_url: '', // will have to let backend clear the former form_url
    });

    res.json(emptyForm);
  }

  createCommentResponseForm(req, res) {
    const { owner, repo, number, user_id, team_id } = req.query;

    const commentQuickResponseForm = formBuilder
      .create()
      .add(createInput('owner', { hidden: true, value: owner }))
      .add(createInput('repo', { hidden: true, value: repo }))
      .add(createInput('number', { hidden: true, value: String(number) }))
      .add(createInput('user_id', { hidden: true, value: user_id }))
      .add(createInput('team_id', { hidden: true, value: team_id }))
      .add(createInput('response', { placeholder: '快速回复' }))
      .add(createSubmit('confirm_response', '确定'))
      .getResult();

    res.json(commentQuickResponseForm);
  }

  async handleCommentResponse(req, res) {
    const { owner, repo, number, user_id, team_id } = req.body.data;

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

      access_token = results[0].token;

      if (!access_token) throw new Error();
    } catch (e) {
      res.json(nonAuthForm);
    }

    debug('access_token:', access_token);

    if (owner && repo && number && access_token) {
      try {
        await githubApi.post(`/repos/${owner}/${repo}/issues/${number}/comments`, {
          body: req.body.data.response,
        }, { params: { access_token }, });
      } catch (e) {
        return res.json(nonAuthForm);
      }
    }

    const emptyForm = formBuilder.create().getResult();
    res.json(emptyForm);
  }
}

module.exports = new FormController();
