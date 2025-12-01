# Først et mellomsteg for å sette opp norsk locale
FROM debian:13-slim AS locale
RUN set -eux; \
	apt-get update; apt-get install -y --no-install-recommends locales; \
	echo 'nb_NO.UTF-8 UTF-8' >> /etc/locale.gen; \
	locale-gen; \
	locale -a | grep 'nb_NO.utf8'

# Selve runtime imaget
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:25-slim

# For å støtte særnorske bokstaver i filnavn
COPY --from=locale /usr/lib/locale /usr/lib/locale

ENV LANG='nb_NO.UTF-8' LC_ALL='nb_NO.UTF-8' TZ="Europe/Oslo"

WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
