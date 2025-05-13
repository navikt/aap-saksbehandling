import { render, screen } from 'lib/test/CustomRender';
import { SamordningGradering } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import { format, subWeeks } from 'date-fns';
import { SamordningGraderingGrunnlag } from 'lib/types/types';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
const grunnlagMedVurderinger: SamordningGraderingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  begrunnelse: 'En grunn',
  vurderinger: [
    {
      ytelseType: 'SYKEPENGER',
      gradering: 20,
      manuell: true,
      periode: {
        fom: format(subWeeks(new Date(), 3), 'yyyy-MM-dd'),
        tom: format(new Date(), 'yyyy-MM-dd'),
      },
    },
  ],
  ytelser: [],
};

const grunnlagMedYtelser: SamordningGraderingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  begrunnelse: 'En grunn',
  vurderinger: [],
  ytelser: [
    {
      gradering: 100,
      periode: {
        fom: '2025-03-01',
        tom: '2025-03-31',
      },
      endringStatus: 'NY',
      kilde: 'SP',
      ytelseType: 'SYKEPENGER',
    },
  ],
};

describe('Samordning gradering', () => {
  test('skal kunne redigere ytelse, periode og gradering for en manuell rad', () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurderinger} behandlingVersjon={1} readOnly={false} />);
    expect(screen.getByRole('combobox', { name: 'Ytelsestype' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Ytelsestype' })).toBeEnabled();

    expect(screen.getByRole('textbox', { name: 'Fra og med' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Fra og med' })).toBeEnabled();

    expect(screen.getByRole('textbox', { name: 'Til og med' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Til og med' })).toBeEnabled();

    expect(screen.getByRole('textbox', { name: 'Utbetalingsgrad' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Utbetalingsgrad' })).toBeEnabled();
  });

  test('kan slette en rad', () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurderinger} behandlingVersjon={1} readOnly={false} />);
    expect(screen.getByRole('button', { name: 'Slett' })).toBeVisible();
  });

  test('gir feilmelding dersom det er funnet ytelser fra kilder, men ikke gjort noen vurderinger', async () => {
    render(<SamordningGradering grunnlag={grunnlagMedYtelser} behandlingVersjon={1} readOnly={false} />);
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(await screen.findByText('Du må gjøre en vurdering av periodene')).toBeVisible();
  });
});
