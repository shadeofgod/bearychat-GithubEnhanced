const express = require('express');
const formController = require('../controllers/formController');
const webhookController = require('../controllers/webhookController');
const githubController = require('../controllers/githubController');
const router = express.Router();

router.get('/hi', function(req, res, next) {
  res.json({ message: 'hi back' });
});

// select channel and create github payload url
router.route('/gp_form')
  .get(formController.createSelectChannelForm)
  .post(formController.createPayloadUrl);

// for github webhook
router.route('/webhook/:vchannelId')
  .post(webhookController.handleGithubEvents);

// interact with github
router.route('/comment_response')
  .get(formController.createCommentResponseForm)
  .post(formController.handleCommentResponse);

// requesting github oauth
router.route('/github_oauth.request')
  .get(githubController.createGithubAuth);

// redirect back from github and save token
router.route('/github_oauth.accept/:team_id/:user_id')
  .get(githubController.saveGithubAuth)


module.exports = router;
