import { render, screen } from 'lib/test/CustomRender';
import { SamordningGradering } from 'components/behandlinger/underveis/samordninggradering/SamordningGradering';
import { format, subWeeks } from 'date-fns';
import { SamordningGraderingGrunnlag } from 'lib/types/types';
import { describe, test, expect } from 'vitest';

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
});
