import { describe, expect, it } from 'vitest';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { SakPersoninfo, SaksInfo } from 'lib/types/types';
import { render, screen } from '@testing-library/react';

const personInformasjon: SakPersoninfo = { navn: 'Peder Ås', fnr: '12345678910' };

const sak: SaksInfo = {
  ident: '12345678910',
  behandlinger: [],
  opprettetTidspunkt: '12. mai',
  saksnummer: 'kjfsdf',
  status: 'OPPRETTET',
  periode: { fom: '12 mai', tom: '27 mai' },
};

describe('SaksinfoBanner', () => {
  it('komponenten rendrer med navn på søker', () => {
    render(<SaksinfoBanner personInformasjon={personInformasjon} sak={sak} referanse={'123'} behandlingVersjon={1} />);
    expect(screen.getByText('Peder Ås')).toBeVisible();
  });

  it('ident fra sak vises', () => {
    render(<SaksinfoBanner personInformasjon={personInformasjon} sak={sak} referanse={'123'} behandlingVersjon={1} />);
    expect(screen.getByText('12345678910')).toBeVisible();
  });

  it('skal ha en knapp for å åpne saksmeny', () => {
    render(<SaksinfoBanner personInformasjon={personInformasjon} sak={sak} referanse={'123'} behandlingVersjon={1} />);

    const knapp = screen.getByRole('button', { name: 'Saksmeny' });

    expect(knapp).toBeVisible();
  });
});
