FROM node:8-alpine
WORKDIR /app
COPY package.json /app/
RUN apk add --no-cache --virtual .build-deps \
	ca-certificates git gzip openssh-client python make g++ \
	&& npm install && apk del .build-deps
ADD . /app
ENV NODE_ENV production
ENV HOST 0.0.0.0
EXPOSE 3000
RUN npm run build
CMD npm start
