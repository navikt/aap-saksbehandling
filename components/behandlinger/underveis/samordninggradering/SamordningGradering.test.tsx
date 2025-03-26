import { render, screen, within } from 'lib/test/CustomRender';
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
    {
      ytelseType: 'SYKEPENGER',
      gradering: 80,
      periode: {
        fom: format(subWeeks(new Date(), 6), 'yyyy-MM-dd'),
        tom: format(subWeeks(new Date(), 4), 'yyyy-MM-dd'),
      },
    },
  ],
  ytelser: [],
};

const grunnlagMedYtelserFraKilde: SamordningGraderingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  begrunnelse: 'En grunn',
  vurderinger: [],
  ytelser: [
    {
      endringStatus: 'NY',
      ytelseType: 'SYKEPENGER',
      kilde: 'SP',
      gradering: 20,
      periode: {
        fom: format(subWeeks(new Date(), 3), 'yyyy-MM-dd'),
        tom: format(new Date(), 'yyyy-MM-dd'),
      },
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
  });

  test('kan kun redigere utbetalingsgrad for ytelse fra kilde', () => {
    render(<SamordningGradering grunnlag={grunnlagMedYtelserFraKilde} behandlingVersjon={1} readOnly={false} />);
    expect(screen.getByRole('textbox', { name: 'Utbetalingsgrad' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Utbetalingsgrad' })).toBeEnabled();

    expect(screen.queryByRole('combobox', { name: 'Ytelsestype' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Fra og med' })).not.toBeInTheDocument();
  });

  test('kan slette en manuell rad', () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurderinger} behandlingVersjon={1} readOnly={false} />);
    const rader = screen.getAllByRole('row');
    const manuellRad = rader[1];

    expect(within(manuellRad).getByRole('button', { name: 'Slett' })).toBeVisible();
  });

  test('kan ikke slette en rad som kommer fra en kilde', () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurderinger} behandlingVersjon={1} readOnly={false} />);
    const rader = screen.getAllByRole('row');
    const ytelseFraKilde = rader[2];

    expect(within(ytelseFraKilde).queryByRole('button', { name: 'Slett' })).not.toBeInTheDocument();
  });
});
