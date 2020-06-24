# https://hub.docker.com/r/buildkite/puppeteer/
FROM buildkite/puppeteer:v3.0.4

WORKDIR /app

COPY ./package.json ./

RUN npm install --production

COPY ./dist/service.js ./

ENTRYPOINT ["node", "service.js"]

EXPOSE 8080

