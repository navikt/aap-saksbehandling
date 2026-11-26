#!/bin/bash

URL="https://localauth-aap.intern.dev.nav.no/entraid/env"

ENV=$(curl $URL)

if [ -z "$ENV" ]; then
  echo "Fikk ingen env-verdier fra localauth"
  exit 1
fi

# Brukes av Next
cat .env-template-dev > .env.local
printf '%s\n' "$ENV" >> .env.local

# Brukes av docker-compose (wonderwall og texas)
printf '%s\n' "$ENV" > .env.dev-gcp
