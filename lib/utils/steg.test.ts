import { describe, it, expect } from 'vitest';
import { BehandlingFlytOgTilstand, FlytGruppe } from 'lib/types/types';
import { getStegSomSkalVises } from 'lib/utils/steg';

const flytAlder: FlytGruppe = {
  skalVises: true,
  erFullført: false,
  stegGruppe: 'ALDER',
  steg: [
    {
      stegType: 'VURDER_ALDER',
      avklaringsbehov: [],
    },
  ],
};

const flytSykdom: FlytGruppe = {
  skalVises: true,
  erFullført: false,
  stegGruppe: 'SYKDOM',
  steg: [
    {
      stegType: 'AVKLAR_SYKDOM',
      avklaringsbehov: [
        {
          definisjon: {
            name: 'AVKLAR_SYKDOM',
            kode: '5003',
            type: 'MANUELT_PÅKREVD',
            løsesISteg: 'AVKLAR_SYKDOM',
            løsesAv: ['VEILEDER'],
            kreverToTrinn: true,
            kvalitetssikres: true,
          },
          status: 'OPPRETTET',
          endringer: [],
        },
      ],
    },
  ],
};

const flytSykdomOgAvklaringsbehovAvbrutt: FlytGruppe = {
  skalVises: true,
  erFullført: false,
  stegGruppe: 'SYKDOM',
  steg: [
    {
      stegType: 'AVKLAR_SYKDOM',
      avklaringsbehov: [
        {
          definisjon: {
            name: 'AVKLAR_SYKDOM',
            kode: '5003',
            type: 'MANUELT_PÅKREVD',
            løsesISteg: 'AVKLAR_SYKDOM',
            løsesAv: ['VEILEDER'],
            kreverToTrinn: true,
            kvalitetssikres: true,
          },
          status: 'AVBRUTT',
          endringer: [],
        },
      ],
    },
  ],
};

const flyt: BehandlingFlytOgTilstand = {
  aktivGruppe: 'SYKDOM',
  prosessering: { status: 'FERDIG', ventendeOppgaver: [] },
  aktivtSteg: 'AVKLAR_SYKDOM',
  behandlingVersjon: 0,
  visning: {
    saksbehandlerReadOnly: false,
    beslutterReadOnly: false,
    visBeslutterKort: false,
    visVentekort: false,
    visKvalitetssikringKort: false,
    kvalitetssikringReadOnly: false,
  },
  flyt: [],
};

describe('getStegSomSkalVises', () => {
  it('skal returnere tomt array dersom ingen steg', () => {
    expect(getStegSomSkalVises('SYKDOM', flyt)).toEqual([]);
  });

  it('skal filtrere bort steg som ikke hører til gruppe', () => {
    const flytMedFlyt = { ...flyt, flyt: [flytAlder] };
    expect(getStegSomSkalVises('SYKDOM', flytMedFlyt)).toEqual([]);
  });
  it('skal returnere steg som hører til gruppe og har avklarigsbehov', () => {
    const flytMedFlyt = { ...flyt, flyt: [flytSykdom] };
    expect(getStegSomSkalVises('SYKDOM', flytMedFlyt)).toEqual(['AVKLAR_SYKDOM']);
  });
  it('skal ikke returnere steg som hører til gruppe med avklaringsbehov som er AVBRUTT', () => {
    const flytMedFlyt = {
      ...flyt,
      flyt: [flytSykdomOgAvklaringsbehovAvbrutt],
    };
    expect(getStegSomSkalVises('SYKDOM', flytMedFlyt)).toEqual([]);
  });
});
