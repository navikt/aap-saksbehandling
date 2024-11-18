FROM gcr.io/distroless/nodejs22-debian12@sha256:c218f62198d07fc67e36fff5639985f29b1bdcf04a601c1d23c0ab1121f55f0b


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV production

EXPOSE 3000

ENV PORT 3000

CMD ["server.js"]
