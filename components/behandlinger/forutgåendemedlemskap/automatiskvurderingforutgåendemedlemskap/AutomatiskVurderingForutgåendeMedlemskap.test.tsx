import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { AutomatiskVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/automatiskvurderingforutgåendemedlemskap/AutomatiskVurderingForutgåendeMedlemskap';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';

const vurdering: AutomatiskLovvalgOgMedlemskapVurdering = {
  kanBehandlesAutomatisk: true,
  tilhørighetVurdering: [
    {
      indikasjon: 'I_NORGE',
      kilde: ['SØKNAD'],
      opplysning: 'opplysning',
      resultat: true,
      vurdertPeriode: 'INNEVÆRENDE_OG_FORRIGE_MND',
      visuellTidslinje: [],
    },
  ],
};
describe('Automatisk vurdering av forutgående medlemskap', () => {
  it('Skal vise overstyringsknapp', () => {
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <AutomatiskVurderingForutgåendeMedlemskap
          vurdering={vurdering}
          setOverstyring={() => {}}
          visOverstyrKnapp={true}
          visOverstyringsBehov={false}
          harYrkesskade={false}
        />
      </FeatureFlagProvider>
    );
    const button = screen.getByText('Overstyr');
    expect(button).toBeVisible();
  });

  it('Skal vise angre overstyringsknapp hvis det allerede er trykket overstyr', () => {
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <AutomatiskVurderingForutgåendeMedlemskap
          vurdering={vurdering}
          setOverstyring={() => {}}
          visOverstyrKnapp={true}
          visOverstyringsBehov={true}
          harYrkesskade={false}
        />
      </FeatureFlagProvider>
    );
    const button = screen.getByText('Angre overstyring');
    expect(button).toBeVisible();
  });
});
