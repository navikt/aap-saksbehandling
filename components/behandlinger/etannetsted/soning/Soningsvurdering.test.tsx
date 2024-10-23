import { describe, expect, it } from 'vitest';
import { Soningsvurdering } from 'components/behandlinger/etannetsted/soning/Soningsvurdering';
import { render, screen } from '@testing-library/react';
import { Soningsgrunnlag } from 'lib/types/types';
import userEvent from '@testing-library/user-event';

const soningsgrunnlag: Soningsgrunnlag = {
  soningsforhold: [
    {
      institusjonstype: 'Fengsel',
      oppholdstype: 'Soningsfange',
      status: 'AKTIV',
      oppholdFra: '2022-10-23',
      avsluttetDato: '2025-10-23',
      kildeinstitusjon: 'Azkaban',
    },
  ],
  vurderinger: [
    {
      vurderingsdato: '2022-10-23',
      vurdering: undefined,
      status: 'UAVKLART',
    },
  ],
};

const user = userEvent.setup();

describe('Soningsvurdering', () => {
  it('har overskrift på nivå 3', () => {
    render(<Soningsvurdering grunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    screen.logTestingPlaygroundURL();
    expect(screen.getByRole('heading', { level: 3, name: 'Soning § 11-26' })).toBeVisible();
  });

  it('har en tekst som informerer om at søker har soningsforhold', () => {
    render(<Soningsvurdering grunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getByText('Søker har følgende soningsforhold')).toBeVisible();
  });

  it('har en beskrivelse av hvordan vilkåret skal vurderes', () => {
    render(<Soningsvurdering grunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(
      screen.getByText(
        'Under opphold i fengsel har ikke søker rett på AAP. Om man soner utenfor fengsel eller arbeider utenfor anstalt har man likevel rett på AAP'
      )
    ).toBeVisible();
  });

  it('har en tabell som lister opp soningsopphold', () => {
    render(<Soningsvurdering grunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('har et felt for begrunnelse', () => {
    render(<Soningsvurdering grunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om medlemmet soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
      })
    ).toBeVisible();
  });

  it('har et for å avgjøre om ytelsen skal stanses', () => {
    render(<Soningsvurdering grunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getByRole('group', { name: 'Skal ytelsen stoppes på grunn av soning?' })).toBeVisible();
  });

  it('datofelt for når vurderingen skal gjelde fra vises ikke på den første vurderingen', () => {
    render(<Soningsvurdering grunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(screen.queryByRole('textbox', { name: 'Vurderingen skal gjelde fra dato' })).not.toBeInTheDocument();
  });

  it('dato for når vurderingen skal gjelde fra vises som ren tekst på den første vurderingen', () => {
    render(<Soningsvurdering grunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getAllByText('23.10.2022')[1]).toBeVisible(); // Det finnes en lik dato i tabellen også
  });

  it('viser et datofelt for når vurderingen skal gjelde fra så lenge det ikke er den første vurderingen', async () => {
    render(<Soningsvurdering grunnlag={soningsgrunnlag} readOnly={false} behandlingsversjon={0} />);
    const leggTilNyVurderingKnapp = screen.getByRole('button', { name: /legg til ny vurdering/i });
    await user.click(leggTilNyVurderingKnapp);
    expect(screen.getByRole('textbox', { name: 'Vurderingen skal gjelde fra dato' })).toBeVisible();
  });
});
