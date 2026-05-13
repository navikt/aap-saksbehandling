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
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cdn.nav.no/team-researchops/sporing/sporing-dev.js';
  script.setAttribute('data-website-id', umamiSporingskode);
  document.head.appendChild(script);
}

export const UmamiTags = {
  LOVVALG_MEDLEMSKAP_INPUT_FRA_DATO: 'LOVVALG_MEDLEMSKAP_INPUT_FRA_DATO',
  LOVVALG_MEDLEMSKAP_INPUT_LOVVALG_BEGRUNNELSE: 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALG_BEGRUNNELSE',
  LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_EØS: 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_EØS',
  LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_ANNET: 'LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_ANNET',
  LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_BEGRUNNELSE: 'LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_BEGRUNNELSE',
  LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_I_FOLKETRYGDEN: 'LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_I_FOLKETRYGDEN',
};
