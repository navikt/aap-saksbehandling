import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { AutomatiskVurderingAvLovvalgOgMedlemskap } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/AutomatiskVurderingAvLovvalgOgMedlemskap';

const vurdering: AutomatiskLovvalgOgMedlemskapVurdering = {
  kanBehandlesAutomatisk: true,
  tilhørighetVurdering: [
    {
      indikasjon: 'I_NORGE',
      kilde: ['SØKNAD'],
      opplysning: 'opplysning',
      resultat: true,
      vurdertPeriode: {
        fom: '2020-01-01',
        tom: '2021-01-01',
      },
    },
  ],
};
describe('Automatisk vurdering av lovvalg og medlemskap', () => {
  it('Skal vise overstyringsknapp', () => {
    render(
      <AutomatiskVurderingAvLovvalgOgMedlemskap
        vurdering={vurdering}
        setOverstyring={() => {}}
        visOverstyrKnapp={true}
        visOverstyringsBehov={false}
      />
    );
    const button = screen.getByText('Overstyr');
    expect(button).toBeVisible();
  });

  it('Skal vise angre overstyringsknapp hvis det allerede er trykket overstyr', () => {
    render(
      <AutomatiskVurderingAvLovvalgOgMedlemskap
        vurdering={vurdering}
        setOverstyring={() => {}}
        visOverstyrKnapp={true}
        visOverstyringsBehov={true}
      />
    );
    const button = screen.getByText('Angre overstyring');
    expect(button).toBeVisible();
  });
});
