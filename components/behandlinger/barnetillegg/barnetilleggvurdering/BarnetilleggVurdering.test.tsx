import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { userEvent } from '@testing-library/user-event';
import { BarnetilleggGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { addDays } from 'date-fns';

const grunnlag: BarnetilleggGrunnlag = {
  folkeregisterbarn: [
    {
      ident: {
        identifikator: '12345678910',
        aktivIdent: true,
      },
      forsorgerPeriode: {
        fom: '2020-02-02',
        tom: '2038-02-02',
      },
    },
  ],
  oppgitteBarn: [],
  barnSomTrengerVurdering: [
    {
      ident: {
        identifikator: '23456789010',
        aktivIdent: true,
      },
      forsorgerPeriode: {
        fom: '2020-01-30',
        tom: '2038-01-30',
      },
    },
  ],
  vurderteBarn: [],
};

describe('barnetillegg', () => {
  const user = userEvent.setup();

  it('skal ha en overskrift', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false} />);
    const overskrift = screen.getByText('Barnetillegg § 11-20 tredje og fjerde ledd');
    expect(overskrift).toBeVisible();
  });

  it('skal ha en dokumenttabell med korrekt heading', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false} />);
    const heading = screen.getByRole('group', {
      name: 'Dokumenter funnet som er relevante for vurdering av barnetillegg §11-20',
    });
    expect(heading).toBeVisible();
  });

  it('skal ha en dokumenttabell med korrekt description', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false} />);

    const description = screen.getByText(
      'Les dokumentene og tilknytt eventuelle dokumenter benyttet til 11-20 vurderingen'
    );

    expect(description).toBeVisible();
  });

  // TODO: Test feiler fordi dokumenterBruktIVurdering ikke blir oppdatert når testen kjører, fungerer i nettleser.
  // Fiks test når vi faktisk skal bruke dokumentlisten
  it.skip('skal ha en liste som viser hvilke dokumenter som er tilknyttet vurderingen', async () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false} />);
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

describe('Manuelt registrerte barn', () => {
  const user = userEvent.setup();

  // TODO navn må hentes, kommer ikke som en del av grunnlaget
  it.skip('skal ha en heading med navn og ident', () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    const heading = screen.getByRole('heading', { name: 'Kjell T Ringen - 12345678910' });
    expect(heading).toBeVisible();
  });

  it('skal ha et begrunnelsesfelt', () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    const felt = screen.getByRole('textbox', {
      name: 'Vurder §11-20 og om det skal beregnes barnetillegg for dette barnet',
    });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding dersom begrunnelsesfelt ikke er besvart', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);

    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Du må gi en begrunnelse');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt hvor det besvares om det skal beregnes barnetillegg for barnet', () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    const felt = screen.getByRole('group', { name: 'Skal det beregnes barnetillegg for dette barnet?' });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding dersom feltet om det skal beregnes barnetillegg ikke er besvart', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);

    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Du må besvare om det skal beregnes barnetillegg for barnet');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt for å sette datoen søkeren har forsørgeransvar for barnet fra dersom det har blitt besvart ja på spørsmålet om det skal beregnes barnetillegg', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);

    const forsørgerAnsvarFelt = screen.queryByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    expect(forsørgerAnsvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    const felt = screen.getByRole('textbox', { name: /søker har forsørgeransvar for barnet fra/i });
    expect(felt).toBeVisible();
  });

  it('skal ha vise feilmelding dersom feltet for datoen søkeren har forsørgeransvar for barnet fra ikke er besvart', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);

    const forsørgeransvarFelt = screen.queryByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    expect(forsørgeransvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Du må sette en dato for når søker har forsørgeransvar for barnet fra');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha en knapp for å kunne sette en sluttdato for forsørgeransvaret', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    const leggTilSluttDatoKnapp = screen.getByRole('button', { name: 'Legg til sluttdato' });
    expect(leggTilSluttDatoKnapp).toBeVisible();
  });

  it('skal vise felt for sluttdato for forsørgeransvare dersom man trykker på knappen legg til sluttdato', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    expect(screen.queryByRole('textbox', { name: /Sluttdato for forsørgeransvaret/i })).not.toBeInTheDocument();

    const leggTilSluttDatoKnapp = screen.getByRole('button', { name: 'Legg til sluttdato' });
    await user.click(leggTilSluttDatoKnapp);

    const sluttDatoFelt = screen.getByRole('textbox', { name: /Sluttdato for forsørgeransvaret/i });
    expect(sluttDatoFelt).toBeVisible();
  });

  it('gir en feilmelding dersom det legges inn en dato frem i tid for når søker har foreldreansvar fra', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const datofelt = screen.getByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    const imorgen = addDays(new Date(), 1);

    await user.type(datofelt, formaterDatoForFrontend(imorgen));
    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Dato for når søker har forsørgeransvar fra kan ikke være frem i tid');
    expect(feilmelding).toBeVisible();
  });

  it.skip('gir en feilmelding dersom det legges inn en ugyldig verdi for når søker har foreldreansvar fra', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const datofelt = screen.getByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });

    await user.type(datofelt, '12.2003');
    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Dato for når søker har forsørgeransvar fra er ikke gyldig');
    expect(feilmelding).toBeVisible();
  });

  it('skal ikke vise knapp for å fullføre vurdering dersom readonly er satt til true', () => {
    render(<BarnetilleggVurdering readOnly={true} grunnlag={grunnlag} behandlingsversjon={1} />);
    const knapp = screen.queryByRole('button', { name: 'Bekreft' });
    expect(knapp).not.toBeInTheDocument();
  });

  async function svarJaPåOmDetSkalBeregnesBarnetillegg() {
    const skalBeregnesBarnetilleggFelt = screen.getByRole('group', {
      name: 'Skal det beregnes barnetillegg for dette barnet?',
    });
    const jaVerdi = within(skalBeregnesBarnetilleggFelt).getByRole('radio', { name: 'Ja' });

    await user.click(jaVerdi);
  }
});
