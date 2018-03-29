FROM node:8
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm config set unsafe-perm true && npm install
ADD . /app
ENV NODE_ENV production
ENV HOST 0.0.0.0
EXPOSE 3000
ARG IS_TESTNET
ENV IS_TESTNET ${IS_TESTNET}
ARG INTERCOM_APPID
ENV INTERCOM_APPID ${INTERCOM_APPID}
ARG GA_TRACKING_ID
ENV GA_TRACKING_ID ${GA_TRACKING_ID}
ARG GTM_ID
ENV GTM_ID ${GTM_ID}
RUN npm run build
CMD npm start
