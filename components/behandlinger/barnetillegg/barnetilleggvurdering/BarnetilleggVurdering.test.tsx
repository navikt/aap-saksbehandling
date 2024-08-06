import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { userEvent } from '@testing-library/user-event';
import { BarnetilleggGrunnlag } from 'lib/types/types';

describe('barnetillegg', () => {
  const user = userEvent.setup();

  const grunnlag: BarnetilleggGrunnlag = {
    folkeregisterbarn: [
      {
        ident: {
          identifikator: '12345678910',
          aktivIdent: true,
        },
        navn: 'Trude Lutt',
        forsorgerPeriode: {
          fom: '2020-02-02',
          tom: '2038-02-02',
        },
      },
    ],
  };

  it('skal ha en overskrift', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false}/>);
    const overskrift = screen.getByText('Barnetillegg § 11-20 tredje og fjerde ledd');
    expect(overskrift).toBeVisible();
  });

  it('skal ha en dokumenttabell med korrekt heading', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false}/>);
    const heading = screen.getByRole('group', {
      name: 'Dokumenter funnet som er relevante for vurdering av barnetillegg §11-20',
    });
    expect(heading).toBeVisible();
  });

  it('skal ha en dokumenttabell med korrekt description', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false}/>);

    const description = screen.getByText(
      'Les dokumentene og tilknytt eventuelle dokumenter benyttet til 11-20 vurderingen'
    );

    expect(description).toBeVisible();
  });

  // TODO: Test feiler fordi dokumenterBruktIVurdering ikke blir oppdatert når testen kjører, fungerer i nettleser.
  // Fiks test når vi faktisk skal bruke dokumentlisten
  it.skip('skal ha en liste som viser hvilke dokumenter som er tilknyttet vurderingen', async () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false}/>);
    const rad = screen.getByRole('row', {
      name: /sykemelding/i,
    });

    await user.click(
      within(rad).getByRole('checkbox', {
        name: /tilknytt dokument til vurdering/i,
      })
    );

    const list = screen.getByRole('list', {
      name: /tilknyttede dokumenter/i,
    });

    const dokument = within(list).getByText(/sykemelding/i);
    expect(dokument).toBeVisible();
  });

  it('skal ha en heading for manuelle barn som er lagt inn av søker', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false} />);
    const heading = screen.getByText('Følgende barn er oppgitt av søker og må vurderes for barnetillegg');
    expect(heading).toBeVisible();
  });

  it('skal ha en description for manuelle barn som er lagt inn av søker', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false} />);
    const description = screen.getByText(
      'Les dokumentene og tilknytt relevante dokumenter til vurdering om det skal beregnes barnetillegg'
    );
    expect(description).toBeVisible();
  });

  it('skal ha en heading for registrerte barn fra folkeregisteret', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false} />);
    const heading = screen.getByText('Følgende barn er funnet i folkeregisteret og vil gi grunnlag for barnetillegg');
    expect(heading).toBeVisible();
  });

  it('skal vise knapp for å fullføre steget dersom readonly er satt til false', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false} />);
    const knapp = screen.getByRole('button', { name: 'Bekreft' });
    expect(knapp).toBeVisible();
  });

  it('skal ikke vise knapp for å fullføre steget dersom readonly er satt til true', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={true} />);
    const knapp = screen.queryByRole('button', { name: 'Bekreft' });
    expect(knapp).not.toBeInTheDocument();
  });
});
