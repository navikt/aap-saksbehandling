FROM gcr.io/distroless/nodejs22-debian12@sha256:d2bf966afe785153974fdd2663c7181dbfdf407d229b5df4adef185ca134da04


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV production

EXPOSE 3000

ENV PORT 3000

CMD ["server.js"]
