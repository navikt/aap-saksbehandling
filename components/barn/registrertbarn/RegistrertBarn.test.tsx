import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';
import { IdentifisertBarn } from 'lib/types/types';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';

const registrertBarn: IdentifisertBarn = {
  ident: {
    identifikator: '98765432121',
    aktivIdent: true,
  },
  fødselsdato: '2020-01-01',
  forsorgerPeriode: { fom: '2020-03-03', tom: '2038-03-03' },
};

describe('registrert barn', () => {
  it('skal ha en heading med ident og hvilken rolle brukeren har for barnet', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} navn={'TOR NADO'} />);
    const heading = screen.getByText('Eget barn - 98765432121');
    expect(heading).toBeVisible();
  });

  it('skal vise navnet på barnet og alderen', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} navn={'TOR NADO'} />);
    const alder = kalkulerAlder(new Date(registrertBarn.fødselsdato));
    const tekst = screen.getByText(`TOR NADO (${alder})`);
    expect(tekst).toBeVisible();
  });

  it('skal vise label for forsørgerperioden for barnet', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} navn={'TOR NADO'} />);
    const label = screen.getByText('Forsørgerperiode');
    expect(label).toBeVisible();
  });

  it('skal vise forsørgerperioden med datoer hvis de er satt', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} navn={'TOR NADO'} />);
    const periode = screen.getByText('03.03.2020 - 03.03.2038');
    expect(periode).toBeVisible();
  });
});
