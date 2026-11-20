import { describe, expect, it, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutomatiskLovvalgOgMedlemskapVurdering, DelvurderingForKrav } from 'lib/types/types';
import { AutomatiskVurderingAvLovvalgOgMedlemskap } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/AutomatiskVurderingAvLovvalgOgMedlemskap';
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
const delvurderinger: DelvurderingForKrav[] = [{ relevantDato: '2025-01-01', delvurdering: vurdering }];

describe('Automatisk vurdering av lovvalg og medlemskap', () => {
  it('Skal vise overstyringsknapp', () => {
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <AutomatiskVurderingAvLovvalgOgMedlemskap
          delvurderinger={delvurderinger}
          setOverstyring={vitest.fn()}
          visOverstyrKnapp={true}
          visOverstyringsBehov={false}
        />
      </FeatureFlagProvider>
    );
    const button = screen.getByText('Overstyr');
    expect(button).toBeVisible();
  });

  it('Skal ikke vise overstyringsknapp dersom visOverstyrKnapp er satt til false', () => {
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <AutomatiskVurderingAvLovvalgOgMedlemskap
          delvurderinger={delvurderinger}
          setOverstyring={vitest.fn()}
          visOverstyrKnapp={false}
          visOverstyringsBehov={false}
        />
      </FeatureFlagProvider>
    );

    const button = screen.queryByRole('button', { name: 'Overstyr' });
    expect(button).not.toBeInTheDocument();
  });

  it('Skal vise angre overstyringsknapp hvis det allerede er trykket overstyr', () => {
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <AutomatiskVurderingAvLovvalgOgMedlemskap
          delvurderinger={delvurderinger}
          setOverstyring={() => {}}
          visOverstyrKnapp={true}
          visOverstyringsBehov={true}
        />
      </FeatureFlagProvider>
    );
    const button = screen.getByText('Angre overstyring');
    expect(button).toBeVisible();
  });

  it('viser delvurderingene nyeste først, med bare den nyeste åpen', async () => {
    const user = userEvent.setup();
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <AutomatiskVurderingAvLovvalgOgMedlemskap
          delvurderinger={[
            { relevantDato: '2025-01-01', delvurdering: vurdering },
            {
              relevantDato: '2025-06-01',
              delvurdering: {
                ...vurdering,
                kanBehandlesAutomatisk: false,
                tilhørighetVurdering: [{ ...vurdering.tilhørighetVurdering[0], opplysning: 'Ny opplysning' }],
              },
            },
          ]}
          setOverstyring={vitest.fn()}
        />
      </FeatureFlagProvider>
    );
    const nyesteKnapp = screen.getByRole('button', { name: 'Gjelder fra 01.06.2025' });
    const eldsteKnapp = screen.getByRole('button', { name: 'Gjelder fra 01.01.2025' });
    const knapper = screen.getAllByRole('button', { name: /^Gjelder fra/ });
    expect(knapper).toEqual([nyesteKnapp, eldsteKnapp]);
    expect(nyesteKnapp).toHaveAttribute('aria-expanded', 'true');
    expect(eldsteKnapp).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Ny opplysning')).toBeVisible();
    expect(screen.getByText('Til manuell vurdering')).toBeVisible();

    await user.click(eldsteKnapp);
    expect(eldsteKnapp).toHaveAttribute('aria-expanded', 'true');
    expect(nyesteKnapp).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('opplysning')).toBeVisible();
    await user.click(nyesteKnapp);
    expect(nyesteKnapp).toHaveAttribute('aria-expanded', 'false');
    expect(eldsteKnapp).toHaveAttribute('aria-expanded', 'true');
  });

  it('viser relevant dato og åpner delvurderingen når det bare finnes ett krav', () => {
    render(
      <FeatureFlagProvider flags={mockedFlags}>
        <AutomatiskVurderingAvLovvalgOgMedlemskap delvurderinger={delvurderinger} setOverstyring={vitest.fn()} />
      </FeatureFlagProvider>
    );
    expect(screen.getByRole('button', { name: 'Gjelder fra 01.01.2025' })).toHaveAttribute('aria-expanded', 'true');
  });
});
