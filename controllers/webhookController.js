const debug = require('debug')('bearychat-githubenhanced:webhook controller');
const { hubotApi } = require('../utils/request');

class WebhookController {
  handleGithubEvents(req, res) {
    const vchannel_id = Buffer.from(req.params.vchannelId, 'hex').toString('utf-8');
    const { body: { issue, comment, sender, action, repository } } = req;

    if (issue && comment) {
      const text = `[${sender.login}](${sender.html_url}) ${action} comment on [#${issue.number} ${issue.title}](${comment.html_url}):\n> ${comment.body}`;

      hubotApi.post('/message.create', {
        vchannel_id,
        text,
        form_url: `${process.env.HOST_API_BASEURL}/comment_response?owner=${repository.owner.login}&number=${issue.number}&repo=${repository.name}`,
      });
    }

    res.sendStatus(200);
  }
}

module.exports = new WebhookController();
