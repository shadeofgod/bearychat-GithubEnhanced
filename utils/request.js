const axios = require('axios');

const token = process.env.HUBOT_TOKEN;

const hubotApi = axios.create({
  baseURL: process.env.HUBOT_API_BASEURL,
  timeout: 3000,
  params: { token }
});

const githubApi = axios.create({
  baseURL: process.env.GITHUB_API_BASEURL,
  timeout: 3000,
});

module.exports = {
  hubotApi,
  githubApi,
}
