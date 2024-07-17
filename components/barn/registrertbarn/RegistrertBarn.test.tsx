import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';
import { IdentifisertBarn } from 'lib/types/types';

const registrertBarn: IdentifisertBarn = {
  navn: 'Anna Nass',
  ident: {
    identifikator: '98765432121',
    aktivIdent: true,
  },
  forsorgerPeriode: { fom: '2020-03-03', tom: '2038-03-03' },
};

describe('registrert barn', () => {
  it('skal ha en heading med navn og ident', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} />);
    const heading = screen.getByText('Anna Nass - 98765432121');
    expect(heading).toBeVisible();
  });

  it('skal ha en tekst som forteller hvilken rolle barnet har', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} />);
    const rolle = screen.getByText('Eget barn');
    expect(rolle).toBeVisible();
  });

  it('skal vise label for forsørgerperioden for barnet', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} />);
    const label = screen.getByText('Forsørgerperiode');
    expect(label).toBeVisible();
  });

  it('skal vise forsørgerperioden med datoer hvis de er satt', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} />);
    const periode = screen.getByText('03.03.2020 - 03.03.2038');
    expect(periode).toBeVisible();
  });
});
