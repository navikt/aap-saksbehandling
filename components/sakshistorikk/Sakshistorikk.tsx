'use client';

import useSWR from 'swr';
import { useSaksnummer } from '../../hooks/saksbehandling/BehandlingHook';
import { clientHentSakshistorikk } from '../../lib/clientApi';
/*
const EVENT_TYPES = {
  VEDTAK: "Fattede vedtak",
  PAA_VENT: "Behandling satt på vent",
  AV_VENT: "Behandling tatt av vent",
  STARTET: "Behandling/vurderingsbehov startet",
  KVALITETSSIKRING: "Kvalitetssikring",
  BESLUTTER: "Beslutter",
  SENDT_BREV: "Sendte brev",
  LEGEERKLAERING: "Mottatt legeerklæring og dialogmelding",
  START_BEHANDLING: "Start behandling",
  SLUTT_BEHANDLING: "Slutt behandling",
};
*/

export function Sakshistorikk() {
  const saksnummer = useSaksnummer();
  const { data: saksHistorikk } = useSWR(`chicko`, () => clientHentSakshistorikk(saksnummer));
  console.log(saksHistorikk);

  return <section></section>;
}
