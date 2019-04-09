FROM node:10
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm config set unsafe-perm true && npm install
ADD . /app
ENV HOST 0.0.0.0
EXPOSE 3000
USER 1337
CMD npm run dev

