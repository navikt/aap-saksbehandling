import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { userEvent } from '@testing-library/user-event';
import { BarnetilleggGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { addDays } from 'date-fns';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';

const grunnlag: BarnetilleggGrunnlag = {
  folkeregisterbarn: [
    {
      ident: {
        identifikator: '12345678910',
        aktivIdent: true,
      },
      fødselsdato: '2023-06-05',
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
      fødselsdato: '2023-05-05',
      forsorgerPeriode: {
        fom: '2020-01-30',
        tom: '2038-01-30',
      },
    },
  ],
  vurderteBarn: [],
};

describe('barnetillegg', () => {
  it('skal ha en overskrift', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false} />);
    const overskrift = screen.getByText('Barnetillegg § 11-20 tredje og fjerde ledd');
    expect(overskrift).toBeVisible();
  });

  it('skal ha en heading for manuelle barn som er lagt inn av søker', () => {
    render(<BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={0} readOnly={false} />);
    const heading = screen.getByText('Følgende barn er oppgitt av søker og må vurderes for barnetillegg');
    expect(heading).toBeVisible();
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

describe('Oppgitte barn', () => {
  const user = userEvent.setup();

  it('skal ha en heading med ident og hvilken rolle brukeren har for barnet', () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    const heading = screen.getByRole('heading', { name: 'Oppgitt fosterbarn - 23456789010' });
    expect(heading).toBeVisible();
  });

  it('skal vise navnet på barnet', () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    const alder = kalkulerAlder(new Date(grunnlag.barnSomTrengerVurdering[0].fødselsdato));
    const tekst = screen.getByText(`Barnet sitt navn (${alder})`);
    expect(tekst).toBeVisible();
  });

  it('skal ha et begrunnelsesfelt', () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    const felt = screen.getByRole('textbox', {
      name: 'Vurder om det skal gis barnetillegg for barnet',
    });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding dersom begrunnelsesfelt ikke er besvart', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);

    await klikkPåBekreft();

    const feilmelding = screen.getByText('Du må gi en begrunnelse');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt hvor det besvares om det skal beregnes barnetillegg for barnet', () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    const felt = screen.getByRole('group', {
      name: /har innbygger hatt forsørgeransvar for fosterbarnet i to år før søknadsdato, eller er forsørgeransvaret av varig karakter\?/i,
    });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding dersom feltet om det skal beregnes barnetillegg ikke er besvart', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);

    await klikkPåBekreft();

    const feilmelding = screen.getByText('Du må besvare om det skal beregnes barnetillegg for barnet');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt for å sette datoen søkeren har forsørgeransvar for barnet fra dersom det har blitt besvart ja på spørsmålet om det skal beregnes barnetillegg', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);

    const forsørgerAnsvarFelt = screen.queryByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    expect(forsørgerAnsvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    const felt = screen.getByRole('textbox', { name: /forsørgeransvar fra/i });
    expect(felt).toBeVisible();
  });

  it('skal ha vise feilmelding dersom feltet for datoen søkeren har forsørgeransvar for barnet fra ikke er besvart', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);

    const forsørgeransvarFelt = screen.queryByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    expect(forsørgeransvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    await fyllUtEnBegrunnelse();
    await klikkPåBekreft();

    const feilmelding = screen.getByText('Du må sette en dato');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise felt for sluttdato for forsørgeransvare dersom man trykker på knappen legg til sluttdato', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    const sluttDatoFelt = screen.getByRole('textbox', { name: /til \(valgfritt\)/i });
    expect(sluttDatoFelt).toBeVisible();
  });

  it('gir en feilmelding dersom det legges inn en dato frem i tid for når søker har foreldreansvar fra', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    await fyllUtEnBegrunnelse();
    const datofelt = screen.getByRole('textbox', {
      name: /forsørgeransvar fra/i,
    });
    const imorgen = addDays(new Date(), 1);

    await user.type(datofelt, formaterDatoForFrontend(imorgen));

    await klikkPåBekreft();

    const feilmelding = screen.getByText('Dato for når søker har forsørgeransvar fra kan ikke være frem i tid');
    expect(feilmelding).toBeVisible();
  });

  it('gir en feilmelding dersom det legges inn en ugyldig verdi for når søker har foreldreansvar fra', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const datofelt = screen.getByRole('textbox', {
      name: /forsørgeransvar fra/i,
    });
    await user.type(datofelt, '12.2003');

    await klikkPåBekreft();

    const feilmelding = screen.getByText('Datoformatet er ikke gyldig. Dato må være på formatet dd.mm.åååå');
    expect(feilmelding).toBeVisible();
  });

  it('viser en feilmelding dersom til-dato er satt før fra-dato', async () => {
    render(<BarnetilleggVurdering behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    await fyllUtEnBegrunnelse();
    const startDato = screen.getByRole('textbox', {
      name: /forsørgeransvar fra/i,
    });

    const sluttDato = screen.getByRole('textbox', { name: /til \(valgfritt\)/i });

    await user.type(startDato, '10.08.2023');
    await user.type(sluttDato, '09.08.2023');

    await klikkPåBekreft();

    expect(screen.getByText('Slutt-dato kan ikke være før start-dato')).toBeVisible();
  });

  it('skal ikke vise knapp for å fullføre vurdering dersom readonly er satt til true', () => {
    render(<BarnetilleggVurdering readOnly={true} grunnlag={grunnlag} behandlingsversjon={1} />);
    const knapp = screen.queryByRole('button', { name: 'Bekreft' });
    expect(knapp).not.toBeInTheDocument();
  });

  it('skal ha en knapp for å legge til flere perioder', () => {
    render(<BarnetilleggVurdering readOnly={false} grunnlag={grunnlag} behandlingsversjon={1} />);
    const knapp = screen.getByRole('button', { name: 'Legg til periode' });
    expect(knapp).toBeInTheDocument();
  });

  it('skal være mulig å legge til flere perioder', async () => {
    render(<BarnetilleggVurdering readOnly={false} grunnlag={grunnlag} behandlingsversjon={1} />);

    const begrunnelsesFelterFørDetErLagtTilEnNy = screen.getAllByRole('textbox', {
      name: 'Vurder om det skal gis barnetillegg for barnet',
    });

    expect(begrunnelsesFelterFørDetErLagtTilEnNy.length).toBe(1);

    const knapp = screen.getByRole('button', { name: 'Legg til periode' });
    await user.click(knapp);

    const begrunnelsesFelter = screen.getAllByRole('textbox', {
      name: 'Vurder om det skal gis barnetillegg for barnet',
    });

    expect(begrunnelsesFelter.length).toBe(2);
  });

  it('skal ikke være mulig å fjerne den første perioden', async () => {
    render(<BarnetilleggVurdering readOnly={false} grunnlag={grunnlag} behandlingsversjon={1} />);

    expect(screen.queryByRole('button', { name: /fjern periode/i })).not.toBeInTheDocument();
  });

  it('knapp for å slette en periode skal vises dersom det legges til flere enn èn periode', async () => {
    render(<BarnetilleggVurdering readOnly={false} grunnlag={grunnlag} behandlingsversjon={1} />);

    expect(
      screen.getAllByRole('textbox', {
        name: 'Vurder om det skal gis barnetillegg for barnet',
      }).length
    ).toBe(1);

    expect(screen.queryByRole('button', { name: /fjern periode/i })).not.toBeInTheDocument();

    const leggTilPeriodeKnapp = screen.getByRole('button', { name: /legg til periode/i });
    await user.click(leggTilPeriodeKnapp);

    expect(
      screen.getAllByRole('textbox', {
        name: 'Vurder om det skal gis barnetillegg for barnet',
      }).length
    ).toBe(2);

    expect(screen.getByRole('button', { name: /fjern periode/i })).toBeInTheDocument();
  });

  it('skal vise en feilmelding dersom det finnes overlappende perioder', async () => {
    render(<BarnetilleggVurdering readOnly={false} grunnlag={grunnlag} behandlingsversjon={1} />);
    const leggTilPeriodeKnapp = screen.getByRole('button', { name: /legg til periode/i });
    await user.click(leggTilPeriodeKnapp);

    const jaValg = screen.getAllByRole('radio', { name: /ja/i });
    await user.click(jaValg[0])
    await user.click(jaValg[1])


    const fomInput = screen.getAllByRole('textbox', { name: /forsørgeransvar fra/i });

    await user.type(fomInput[0], '19.09.2024');
    await user.type(fomInput[1], '19.09.2025');

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Det finnes overlappende perioder');
    expect(feilmelding).toBeVisible();
  });

  async function svarJaPåOmDetSkalBeregnesBarnetillegg() {
    const skalBeregnesBarnetilleggFelt = screen.getByRole('group', {
      name: /har innbygger hatt forsørgeransvar for fosterbarnet i to år før søknadsdato, eller er forsørgeransvaret av varig karakter\?/i,
    });
    const jaVerdi = within(skalBeregnesBarnetilleggFelt).getByRole('radio', { name: 'Ja' });

    await user.click(jaVerdi);
  }

  const fyllUtEnBegrunnelse = async () => {
    const begrunnelsesfelt = screen.getByRole('textbox', {
      name: 'Vurder om det skal gis barnetillegg for barnet',
    });
    await user.type(begrunnelsesfelt, 'Dette er en begrunnelse');
  };

  const klikkPåBekreft = async () => {
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
  };
});
