FROM alpine:3.7
RUN apk add --update nodejs nodejs-npm

WORKDIR /deployer
ADD . /deployer
ENTRYPOINT [ "npm", "run", "server"]
