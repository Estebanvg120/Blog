FROM node:18

RUN mkdir -p /home/app
COPY . /home/app

EXPOSE 3900

CMD ["node", "/home/app/index.js"]