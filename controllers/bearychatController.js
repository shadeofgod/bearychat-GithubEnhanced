const debug = require('debug')('bearychat-githubenhanced:Bearychat Controller');
const { hubotApi, githubApi } = require('../utils/request');
const formBuilder = require('../utils/formBuilder');
const {
  createChannelSelect,
  createSubmit,
} = require('../utils/components');


class BearychatController {
  handleEventWebhook(req, res) {
    debug(req.body);
    res.sendStatus(200);
  }

  handleWebHook(req, res) {
    debug(req.body);
    const { channel_name, vchannel } = req.body;

    if (channel_name) return;

    const selectChannelForm = formBuilder
      .create()
      .add(createChannelSelect('target_channel', {
        placeholder: 'Select a channel',
        label: '请选择推送要发送到的讨论组：',
      }))
      .add(createSubmit('confirm_channel', '确定'))
      .getResult();

    hubotApi.post('/message.create', {
      vchannel_id: vchannel,
      text: '选择将 GitHub 上的 Repo 动态实时推送到指定讨论组',
      form_url: `${process.env.HOST_API_BASEURL}/gp_form`,
      form: selectChannelForm,
    });

    res.sendStatus(200);
  }
}

module.exports = new BearychatController();
