import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { tilhørighetVurdering } from 'lib/types/types';
import { TilhørighetsVurderingTabell } from './TilhørighetsVurderingTabell';

describe('TilhørighetsVurderingTabell', () => {
  it('skal vise bosattstatus og norsk statsborgerskap i en utvidbar rad', async () => {
    const user = userEvent.setup();
    const vurdering: tilhørighetVurdering = {
      indikasjon: 'I_NORGE',
      kilde: ['PDL'],
      opplysning: 'Brukeren er bosatt og norsk statsborger',
      resultat: true,
      vurdertPeriode: 'INNEVÆRENDE_OG_FORRIGE_MND',
      visuellTidslinje: [],
      bosattStatusOgNorskStatsborgerskap: {
        personStatus: 'bosatt',
        statsborgerskap: [
          {
            land: 'NOR',
            gyldigFraOgMed: '2025-01-01',
            gyldigTilOgMed: '2025-12-31',
          },
        ],
      },
    };

    render(
      <TilhørighetsVurderingTabell
        vurdering={[vurdering]}
        oppfyllerOpplysningeneKravene={true}
        oppfyllerOpplysningeneKraveneTekst="Oppfyller kravene"
      />
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('bosatt')).toBeVisible();
    expect(screen.getByText('Norge, NOR')).toBeVisible();
    expect(screen.getByText('01.01.2025 - 31.12.2025')).toBeVisible();
  });
});
