FROM debian:12-slim AS locale

# Sakset og tilpasset til NO fra https://github.com/docker-library/postgres/blob/master/17/bookworm/Dockerfile
# make the "nb_NO.UTF-8" locale so app will be utf-8 enabled by default
RUN set -eux; \
	if [ -f /etc/dpkg/dpkg.cfg.d/docker ]; then \
# if this file exists, we're likely in "debian:xxx-slim", and locales are thus being excluded so we need to remove that exclusion (since we need locales)
		grep -q '/usr/share/locale' /etc/dpkg/dpkg.cfg.d/docker; \
		sed -ri '/\/usr\/share\/locale/d' /etc/dpkg/dpkg.cfg.d/docker; \
		! grep -q '/usr/share/locale' /etc/dpkg/dpkg.cfg.d/docker; \
	fi; \
	apt-get update; apt-get install -y --no-install-recommends locales; rm -rf /var/lib/apt/lists/*; \
	echo 'nb_NO.UTF-8 UTF-8' >> /etc/locale.gen; \
	locale-gen; \
	locale -a | grep 'nb_NO.utf8'

FROM gcr.io/distroless/nodejs22-debian12@sha256:5bbfaef4976723a9574efdeea941ca4f2a30b271a8b9ad6a1036dbaae68f855d

COPY --from=locale /usr/lib/locale /usr/lib/locale
ENV LANG='nb_NO.UTF-8' LC_ALL='nb_NO.UTF-8' TZ="Europe/Oslo"

WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
