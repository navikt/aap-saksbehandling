#!/bin/bash

read -r -p "Dette vil overskrive .env.local – vil du fortsette? [Y/n]: " OVERWRITE_ENV

if [[ "$OVERWRITE_ENV" =~ ^[Nn] ]]; then
  echo "INFO: Avbryter..."
  exit 0
fi

if ! ENV=$(curl -fsS "https://localauth-aap.intern.dev.nav.no/entraid/env"); then
  echo "ERROR: Kunne ikke hente env-verdier fra localauth" >&2
  exit 1
fi

if [ -z "$ENV" ]; then
  echo "ERROR: Fikk ingen env-verdier fra localauth"
  exit 1
fi

echo "INFO: Hentet env-verdier fra localauth, oppdaterer .env.local og .env.dev-gcp"

# Brukes av Next
cat .env-template-dev > .env.local
printf '%s\n' "$ENV" >> .env.local

# Brukes av docker-compose (wonderwall og texas)
printf '%s\n' "$ENV" > .env.dev-gcp

echo "INFO: .env.local og .env.dev-gcp ble oppdatert med verdier fra localauth. "
