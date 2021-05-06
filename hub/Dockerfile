FROM alpine:3.7
RUN apk add --update nodejs nodejs-npm

WORKDIR /app
ADD . /app
ENTRYPOINT [ "node", "./src/app.js", "-o"]