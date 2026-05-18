'use client';

import { useEffect } from 'react';

const umamiSporingskode = 'ebb233f3-6c6d-4b9f-b84d-9a11a3c2f16f';

export const UmamiScript = () => {
  useEffect(() => {
    loadTracker();
  }, []);

  return null;
};

function loadTracker() {
  (window as unknown as Window & { umamiBeforeSend: typeof umamiBeforeSend }).umamiBeforeSend = umamiBeforeSend;

  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cdn.nav.no/team-researchops/sporing/sporing-dev.js';
  script.setAttribute('data-website-id', umamiSporingskode);
  script.setAttribute('data-before-send', 'umamiBeforeSend');
  document.head.appendChild(script);
}

function umamiBeforeSend(type: string, payload: { url?: string }) {
  if (payload.url) {
    const normalisertUrl = payload.url
      .replace(/\/saksbehandling\/sak\/[^/]+\/[^/]+/, '/saksbehandling/sak/{saksid}/{behandlingsreferanse}')
      .replace(/\/saksbehandling\/sak\/[^/]+/, '/saksbehandling/sak/{saksid}')
      .replace(
        /\/postmottak\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
        '/postmottak/{referanse}'
      );
    payload.url = normalisertUrl;
  }
  return payload;
}

export const UmamiTags = {
  LOVVALG_MEDLEMSKAP_VARIGHET_HENDELSER: 'LOVVALG_MEDLEMSKAP_VARIGHET_HENDELSER',
  LOVVALG_MEDLEMSKAP_INPUT_FRA_DATO: 'LOVVALG_MEDLEMSKAP_INPUT_FRA_DATO',
  LOVVALG_MEDLEMSKAP_INPUT_LOVVALG_BEGRUNNELSE: 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALG_BEGRUNNELSE',
  LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_EØS: 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_EØS',
  LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_ANNET: 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_ANNET',
  LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_BEGRUNNELSE: 'LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_BEGRUNNELSE',
  LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_I_FOLKETRYGDEN: 'LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_I_FOLKETRYGDEN',
  LOVVALG_MEDLEMSKAP_STEG_FULLFØRT: 'LOVVALG_MEDLEMSKAP_STEG_FULLFØRT',
};
