import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { SaksInformasjon } from 'lib/clientApi';
import { SakPersoninfo, SaksInfo } from 'lib/types/types';
import { render, screen } from '@testing-library/react';
const personInformasjon: SakPersoninfo = { navn: 'Peder Ås', fnr: '12345678910' };
const saksinfo: SaksInformasjon = {
  søker: {
    navn: 'Peder Ås',
    fnr: '123456 78910',
  },
  labels: [{ type: 'Førstegangsbehandling' }, { type: 'Fra sykepenger' }, { type: 'Lokalkontor: NAV Grünerløkka' }],
  sistEndret: {
    navn: 'Marte Kirkerud',
    tidspunkt: '12.12.2020 kl 12:12',
  },
};
const ident = '12345678910';
const sak: SaksInfo = {
  ident,
  behandlinger: [],
  saksnummer: 'kjfsdf',
  status: 'OPPRETTET',
  periode: { fom: '12 main', tom: '27 mai' },
};
describe('SaksinfoBanner', () => {
  it('komponenten rendrer med navn på søker', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        saksInfo={saksinfo}
        sak={sak}
        referanse={'123'}
        behandlingVersjon={1}
      />
    );
    expect(screen.getByText('Peder Ås')).toBeVisible();
  });
  it('ident fra sak vises', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        saksInfo={saksinfo}
        sak={sak}
        referanse={'123'}
        behandlingVersjon={1}
      />
    );
    expect(screen.getByText(ident)).toBeVisible();
  });
});
