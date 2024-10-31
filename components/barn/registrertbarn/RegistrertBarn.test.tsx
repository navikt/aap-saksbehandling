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
  it('har en heading med navn,pid og alder', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} navn={'TOR NADO'} />);
    const forventetAlder = kalkulerAlder(new Date(registrertBarn.fødselsdato));
    expect(screen.getByText(`TOR NADO, ${registrertBarn.ident.identifikator} (${forventetAlder})`)).toBeVisible();
  });

  it('har en tekst som viser at det er et folkeregistrert barn', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} navn={'TOR NADO'} />);
    expect(screen.getByText('Folkeregistrert barn')).toBeVisible();
  });

  it('viser forsørgerperiode', () => {
    render(<RegistrertBarn registrertBarn={registrertBarn} navn={'TOR NADO'} />);
    expect(screen.getByText(/^Forsørgerperiode: 03.03.2020 - 03.03.2038$/)).toBeVisible();
  });
});
