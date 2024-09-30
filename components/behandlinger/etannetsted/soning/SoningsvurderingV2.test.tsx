import { describe, expect, it } from 'vitest';
import { SoningsvurderingV2 } from './SoningsvurderingV2';
import { render, screen, within } from '@testing-library/react';
import { SoningsgrunnlagResponse } from 'lib/types/types';
import userEvent from '@testing-library/user-event';

const soningsgrunnlag: SoningsgrunnlagResponse = {
  soningsopphold: [
    {
      oppholdFra: '2024-08-06',
      avsluttetDato: '2024-12-01',
      oppholdstype: 'sdf',
      institusjonstype: 'fs',
      kildeinstitusjon: 'a',
      status: '',
    },
  ],
};

const user = userEvent.setup();

describe('SoningsvurderingV2', () => {
  it('har overskrift på nivå 3', () => {
    render(<SoningsvurderingV2 soningsgrunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Soning § 11-26' })).toBeVisible();
  });

  it('har en tekst som informerer om at søker har soningsforhold', () => {
    render(<SoningsvurderingV2 soningsgrunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getByText('Søker har følgende soningsforhold')).toBeVisible();
  });

  it('har en beskrivelse av hvordan vilkåret skal vurderes', () => {
    render(<SoningsvurderingV2 soningsgrunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(
      screen.getByText(
        'Under opphold i fengsel har ikke søker rett på AAP. Om man soner utenfor fengsel eller arbeider utenfor anstalt har man likevel rett på AAP'
      )
    ).toBeVisible();
  });

  it('har en tabell som lister opp soningsopphold', () => {
    render(<SoningsvurderingV2 soningsgrunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('har et felt for begrunnelse', () => {
    render(<SoningsvurderingV2 soningsgrunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om medlemmet soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
      })
    ).toBeVisible();
  });

  it('har et for å avgjøre om ytelsen skal stanses', () => {
    render(<SoningsvurderingV2 soningsgrunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getByRole('group', { name: 'Skal ytelsen stoppes på grunn av soning?' })).toBeVisible();
  });

  it('datofelt for når ytelsen skal stanses fra vises ikke initielt', () => {
    render(<SoningsvurderingV2 soningsgrunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(screen.queryByRole('textbox', { name: 'Når skal ytelsen stanses fra?' })).not.toBeInTheDocument();
  });

  it('viser et datofelt for når ytelsen skal stoppes fra når det svares "ja" på at ytelsen skal stoppes', async () => {
    render(<SoningsvurderingV2 soningsgrunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    const gruppe = screen.getByRole('group', { name: 'Skal ytelsen stoppes på grunn av soning?' });
    const jaValg = within(gruppe).getByRole('radio', { name: 'Ja' });
    await user.click(jaValg);
    expect(screen.getByRole('textbox', { name: 'Ytelsen skal opphøre fra dato' })).toBeVisible();
  });
});
