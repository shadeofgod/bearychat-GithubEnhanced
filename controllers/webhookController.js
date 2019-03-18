const debug = require('debug')('bearychat-githubenhanced:webhook controller');
const { hubotApi } = require('../utils/request');
const formBuilder = require('../utils/formBuilder');
const {
  createSubmit,
  createInput,
} = require('../utils/components');

class WebhookController {
  handleGithubEvents(req, res) {
    const vchannel_id = Buffer.from(req.params.vchannelId, 'hex').toString('utf-8');
    const { body: { issue, comment, sender, action, repository } } = req;

    if (issue && comment) {
      const text = `[${sender.login}](${sender.html_url}) ${action} comment on [#${issue.number} ${issue.title}](${comment.html_url}):\n> ${comment.body}`;

      const form = formBuilder
        .create()
        .add(createInput('response', { placeholder: '快速回复' }))
        .add(createSubmit('confirm_response', '确定'))
        .getResult();

      hubotApi.post('/message.create', {
        vchannel_id,
        text,
        form_url: `${process.env.HOST_API_BASEURL}/comment_response?owner=${repository.owner.login}&number=${issue.number}&repo=${repository.name}`,
        form,
      });
    }

    res.sendStatus(200);
  }
}

module.exports = new WebhookController();
