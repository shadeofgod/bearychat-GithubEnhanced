FROM node:8.11-alpine

ARG build_date
ARG commit
ARG version
ENV WORKSPACE /workspace

ENV PORT 3000
ENV DEBUG "bearychat-githubenhanced:*"
ENV NODE_ENV "production"
ENV HOST_API_BASEURL "http://beary.bearychat.com/api"
ENV GITHUB_API_BASEURL "https://api.github.com"
ENV GITHUB_APP_CLIENT_ID ""
ENV GITHUB_APP_CLIENT_SECRET ""
ENV GITHUB_OAUTH_URL "https://github.com/login/oauth/authorize"
ENV GITHUB_OAUTH_TOKEN_URL "https://github.com/login/oauth/access_token"
ENV DB_HOST "127.0.0.1"
ENV DB_USER "root"
ENV DB_PASSWORD ""
ENV DB_NAME "github-enhanced"
ENV HUBOT_TOKEN ""
ENV HUBOT_API_BASEURL "https://api.bearychat.com/v1/"

RUN mkdir -p $WORKSPACE
WORKDIR $WORKSPACE

COPY ./ /$WORKSPACE

# Generate version
RUN echo "$version" >> $workspace/version
RUN echo "$commit" >> $workspace/commit
RUN echo "$build_date" >> $workspace/build_date

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "prod"]
