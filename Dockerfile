FROM node:8
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
ADD . /app
ENV NODE_ENV production
ENV HOST 0.0.0.0
EXPOSE 3000
RUN npm run build
CMD npm start
