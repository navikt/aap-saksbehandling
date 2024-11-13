FROM gcr.io/distroless/nodejs22-debian12@sha256:0b5c394b935b1bf9b5e2ea24e14e66823c1227c4f62cc9bbf274e276b76c979a


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV production

EXPOSE 3000

ENV PORT 3000

CMD ["server.js"]
