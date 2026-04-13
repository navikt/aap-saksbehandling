import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';
import { IdentifisertBarn } from 'lib/types/types';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';

const registrertBarn: IdentifisertBarn = {
  ident: {
    identifikator: '98765432121',
    aktivIdent: true,
  },
  fodselsDato: '2020-01-01',
  forsorgerPeriode: { fom: '2020-03-03', tom: '2038-03-03' },
};

const registrertDødtBarn: IdentifisertBarn = {
  ident: {
    identifikator: '98765432121',
    aktivIdent: true,
  },
  fodselsDato: '2020-01-01',
  dodsDato: '2020-01-03',
};

describe('registrert barn', () => {
  it('har en heading med navn,pid og alder', () => {
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <RegistrertBarn registrertBarn={registrertBarn} navn={'TOR NADO'} />
      </FeatureFlagProvider>
    );
    const forventetAlder = kalkulerAlder(new Date(registrertBarn.fodselsDato!!));
    expect(screen.getByText(`TOR NADO, ${registrertBarn?.ident?.identifikator} (${forventetAlder})`)).toBeVisible();
  });

  it('har en tekst som viser at det er et folkeregistrert barn', () => {
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <RegistrertBarn registrertBarn={registrertBarn} navn={'TOR NADO'} />
      </FeatureFlagProvider>
    );
    expect(screen.getByText('Folkeregistrert barn')).toBeVisible();
  });

  it('viser fyller 18 år', () => {
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <RegistrertBarn registrertBarn={registrertBarn} navn={'TOR NADO'} />
      </FeatureFlagProvider>
    );
    expect(screen.getByText('Fyller 18 år: 03.03.2038')).toBeVisible();
  });

  it('viser dødsdato', () => {
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <RegistrertBarn registrertBarn={registrertDødtBarn} navn={'TOR NADO'} />
      </FeatureFlagProvider>
    );
    expect(screen.getByText('Død: 03.01.2020')).toBeVisible();
  });
});
