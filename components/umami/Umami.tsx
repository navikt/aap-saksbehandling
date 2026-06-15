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

export type UmamiTag =
  | 'STEG_TREKK_SØKNAD_VARIGHET'
  | 'STEG_RETTIGHETSPERIODE_VARIGHET'
  | 'STEG_AVSLAG_11_27_VARIGHET'
  | 'STEG_LOVVALG_MEDLEMSKAP_VARIGHET'
  | 'STEG_STUDENT_VARIGHET'
  | 'STEG_YRKESSKADE_VARIGHET'
  | 'STEG_SYKEPENGEERSTATNING_VARIGHET'
  | 'STEG_FASTSETT_BEREGNINGSTIDSPUNKT_VARIGHET'
  | 'STEG_YRKESSKADE_GRUNNLAGSBEREGNING_VARIGHET'
  | 'STEG_MANGLENDE_LIGNING_VARIGHET'
  | 'STEG_INNTEKTSBORTFALL_VARIGHET'
  | 'STEG_FORUTGÅENDE_MEDLEMSKAP_VARIGHET'
  | 'STEG_OPPHOLDSKRAV_VARIGHET'
  | 'STEG_BARNETILLEGG_VARIGHET'
  | 'STEG_INSTITUSJON_VARIGHET'
  | 'STEG_SONINGSFORHOLD_VARIGHET'
  | 'STEG_SAMORDNING_GRADERING_VARIGHET'
  | 'STEG_SAMORDNING_UFØRE_VARIGHET'
  | 'STEG_SAMORDNING_TJENESTEPENSJON_VARIGHET'
  | 'STEG_SAMORDNING_ARBEIDSGIVER_VARIGHET'
  | 'STEG_BARNEPENSJON_VARIGHET'
  | 'STEG_SYKESTIPEND_VARIGHET'
  | 'STEG_SAMORDNING_ANDRE_STATLIGE_YTELSER_VARIGHET'
  | 'STEG_VEDTAKSLENGDE_VARIGHET'
  | 'STEG_FORESLÅ_VEDTAK_VEDTAKSLENGDE_VARIGHET'
  | 'STEG_IKKEOPPFYLT_MELDEPLIKT_VARIGHET'
  | 'STEG_UNDERVEIS_VARIGHET'
  | 'STEG_FORESLÅ_VEDTAK_VARIGHET'
  | 'STEG_BESLUTTER_VARIGHET'
  | 'STEG_KVALITETSSIKRER_VARIGHET'
  | 'STEG_AVBRYT_REVURDERING_VARIGHET'
  | 'STEG_SVAR_FRA_ANDREINSTANS_VARIGHET'
  | 'LOVVALG_MEDLEMSKAP_VARIGHET_HENDELSER'
  | 'LOVVALG_MEDLEMSKAP_INPUT_FRA_DATO'
  | 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALG_BEGRUNNELSE'
  | 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_EØS'
  | 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_ANNET'
  | 'LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_BEGRUNNELSE'
  | 'LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_I_FOLKETRYGDEN'
  | 'BESLUTTER_VARIGHET_HENDELSER'
  | 'KVALITETSSIKRER_VARIGHET_HENDELSER';
