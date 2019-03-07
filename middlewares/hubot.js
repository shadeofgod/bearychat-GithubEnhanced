const RTMClient = require('bearychat-rtm-client');
// TODO use `bearychat` lib for breaychat production environment
// const HTTPClient = require('bearychat').HTTPClient;
const WebSocket = require('ws');
const debug = require('debug')('bearychat-githubenhanced:hubot middleware');
const { hubotApi } = require('../utils/request');

let hubotId;

function handleRTMEvent(message) {
  switch (message.type) {
    case 'message':
      handleMessage(message);
      break;
    default:
  }
}

async function handleMessage(message) {
  if (message.uid === hubotId) return;
  debug('收到消息：', message.text);

  hubotApi.post('/message.create', {
    vchannel_id: message.vchannel_id,
    text: '选择将 GitHub 上的 Repo 动态实时推送到指定讨论组',
    form_url: `${process.env.HOST_API_BASEURL}/gp_form`,
  });
}

const createHubotMiddleware = (token) => {
  debug('creating hubot connection with token', token);
  // const httpClient = new HTTPClient(token);

  hubotApi.get('/user.me').then(res => hubotId = res.data.id);

  const rtmClient = new RTMClient({
    url() {
      return hubotApi.post('/rtm.start').then(res => res.data.ws_host);
    },
    WebSocket,
  });

  const Events = RTMClient.RTMClientEvents;

  rtmClient.on(Events.EVENT, handleRTMEvent);

  return (req, res, next) => {
    // req.bcHttpClient = httpClient;
    // req.bcRtmClient = rtmClient;
    next();
  }
}


module.exports = createHubotMiddleware;
