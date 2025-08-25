import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BehandlingsHendelserTidslinje } from 'components/sakshistorikk/BehandlingsHendelserTidslinje';
import { BehandlingsHistorikk } from 'lib/types/types';
const historikk: BehandlingsHistorikk = {
  hendelser: [
    {
      hendelse: 'SENDT_TIL_KVALITETSSIKRER',
      tidspunkt: '2025-08-22T15:10:58.071',
      utførtAv: 'Kelvin',
      årsakerTilRetur: [],
      årsakTilSattPåVent: null,
      årsakerTilOpprettelse: [],
      begrunnelse: '',
      resultat: null,
    },
    {
      hendelse: 'RETUR_FRA_KVALITETSSIKRER',
      tidspunkt: '2025-08-22T15:10:17.538',
      utførtAv: 'VEILEDER',
      årsakerTilRetur: [
        {
          årsak: 'MANGELFULL_BEGRUNNELSE',
          årsakFritekst: null,
        },
        {
          årsak: 'FEIL_LOVANVENDELSE',
          årsakFritekst: null,
        },
      ],
      årsakTilSattPåVent: null,
      årsakerTilOpprettelse: [],
      begrunnelse: 'asdf',
      resultat: null,
    },
    {
      hendelse: 'SENDT_TIL_KVALITETSSIKRER',
      tidspunkt: '2025-08-22T15:09:39.991',
      utførtAv: 'Kelvin',
      årsakerTilRetur: [],
      årsakTilSattPåVent: null,
      årsakerTilOpprettelse: [],
      begrunnelse: '',
      resultat: null,
    },
    {
      hendelse: 'FØRSTEGANGSBEHANDLING_OPPRETTET',
      tidspunkt: '2025-08-22T15:08:41.679',
      utførtAv: null,
      årsakerTilRetur: [],
      årsakTilSattPåVent: null,
      årsakerTilOpprettelse: ['MOTTATT_SØKNAD'],
      begrunnelse: null,
      resultat: null,
    },
  ],
};
describe('Sakshistorikk', () => {
  it('Skal vise korrekt label dersom aksjon er FØRSTEGANGSBEHANDLING_OPPRETTET', () => {
    render(<BehandlingsHendelserTidslinje hendelser={historikk.hendelser} defaultKollapset={false} />);
    expect(screen.getByText('Førstegangsbehandling opprettet')).toBeVisible();
  });
});
