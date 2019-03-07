const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Github Enhanced' });
});

router.get('/auth_success', function(req, res, next) {
  res.render('auth_success', { title: 'Github Enhanced' });
});

module.exports = router;
