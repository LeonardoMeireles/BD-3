FROM node:erbium-alpine3.14

WORKDIR /usr/src/trava-air

COPY . .

EXPOSE 8000

RUN npm install

ENTRYPOINT [ "yarn" ]

CMD [ "start" ]