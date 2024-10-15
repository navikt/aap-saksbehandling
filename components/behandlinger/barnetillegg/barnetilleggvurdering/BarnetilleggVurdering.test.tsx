import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { userEvent } from '@testing-library/user-event';
import { BarnetilleggGrunnlag, BehandlingPersoninfo } from 'lib/types/types';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';

const grunnlag: BarnetilleggGrunnlag = {
  søknadstidspunkt: '12.12.2023',
  folkeregisterbarn: [
    {
      ident: {
        identifikator: '01987654321',
        aktivIdent: true,
      },
      fødselsdato: '2023-06-05',
      forsorgerPeriode: {
        fom: '2020-02-02',
        tom: '2038-02-02',
      },
    },
  ],
  barnSomTrengerVurdering: [
    {
      ident: {
        identifikator: '12345678910',
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

const behandlingPersonInfo: BehandlingPersoninfo = {
  info: {
    '01987654321': 'TOR NADO',
    '12345678910': 'HELLO PELLO',
  },
};

describe('barnetillegg', () => {
  it('skal ha en overskrift', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const overskrift = screen.getByText('Barnetillegg § 11-20 tredje og fjerde ledd');
    expect(overskrift).toBeVisible();
  });

  it('skal ha en heading for manuelle barn som er lagt inn av søker', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const heading = screen.getByText('Følgende barn er oppgitt av søker og må vurderes for barnetillegg');
    expect(heading).toBeVisible();
  });

  it('skal ha en heading for registrerte barn fra folkeregisteret', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const heading = screen.getByText('Følgende barn er funnet i folkeregisteret og vil gi grunnlag for barnetillegg');
    expect(heading).toBeVisible();
  });

  it('skal vise knapp for å fullføre steget dersom readonly er satt til false', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const knapp = screen.getByRole('button', { name: 'Bekreft' });
    expect(knapp).toBeVisible();
  });

  it('skal ikke vise knapp for å fullføre steget dersom readonly er satt til true', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        harAvklaringsbehov={true}
        behandlingsversjon={0}
        readOnly={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const knapp = screen.queryByRole('button', { name: 'Bekreft' });
    expect(knapp).not.toBeInTheDocument();
  });
});

describe('Oppgitte barn', () => {
  const user = userEvent.setup();

  it('skal ha en heading med ident og hvilken rolle brukeren har for barnet', () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    const heading = screen.getByRole('heading', {
      name: /oppgitt fosterbarn - 12345678910/i,
    });
    expect(heading).toBeVisible();
  });

  it('skal vise navnet på barnet', () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const alder = kalkulerAlder(new Date(grunnlag.barnSomTrengerVurdering[0].fødselsdato));
    const tekst = screen.getByText(`HELLO PELLO (${alder})`);
    expect(tekst).toBeVisible();
  });

  it('skal ha et begrunnelsesfelt', () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const felt = screen.getByRole('textbox', {
      name: 'Vurder om det skal gis barnetillegg for barnet',
    });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding dersom begrunnelsesfelt ikke er besvart', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    await klikkPåBekreft();

    const feilmelding = screen.getByText('Du må gi en begrunnelse');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt hvor det besvares om det skal beregnes barnetillegg for barnet', () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const felt = screen.getByRole('group', {
      name: /har innbygger hatt forsørgeransvar for fosterbarnet i to år før søknadsdato, eller er forsørgeransvaret av varig karakter\?/i,
    });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding dersom feltet om det skal beregnes barnetillegg ikke er besvart', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    await klikkPåBekreft();

    const feilmelding = screen.getByText('Du må besvare om det skal beregnes barnetillegg for barnet');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt for å sette datoen søkeren har forsørgeransvar for barnet fra dersom det har blitt besvart ja på spørsmålet om det skal beregnes barnetillegg', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    const forsørgerAnsvarFelt = screen.queryByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    expect(forsørgerAnsvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    const felt = screen.getByRole('textbox', { name: /forsørgeransvar fra/i });
    expect(felt).toBeVisible();
  });

  it('skal ha vise feilmelding dersom feltet for datoen søkeren har forsørgeransvar for barnet fra ikke er besvart', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    const forsørgeransvarFelt = screen.queryByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    expect(forsørgeransvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    await fyllUtEnBegrunnelse();
    await klikkPåBekreft();

    const feilmelding = screen.getByText('Du må sette en dato');
    expect(feilmelding).toBeVisible();
  });

  it('gir en feilmelding dersom det legges inn en ugyldig verdi for når søker har foreldreansvar fra', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        harAvklaringsbehov={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const datofelt = screen.getByRole('textbox', {
      name: /forsørgeransvar fra/i,
    });
    await user.type(datofelt, '12.2003');

    await klikkPåBekreft();

    const feilmelding = screen.getByText('Datoformatet er ikke gyldig. Dato må være på formatet dd.mm.åååå');
    expect(feilmelding).toBeVisible();
  });

  it('skal ikke vise knapp for å fullføre vurdering dersom readonly er satt til true', () => {
    render(
      <BarnetilleggVurdering
        readOnly={true}
        harAvklaringsbehov={true}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const knapp = screen.queryByRole('button', { name: 'Bekreft' });
    expect(knapp).not.toBeInTheDocument();
  });

  it('skal ha en knapp for å legge til flere vurderinger', () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        harAvklaringsbehov={true}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const knapp = screen.getByRole('button', { name: 'Legg til vurdering' });
    expect(knapp).toBeInTheDocument();
  });

  it('skal være mulig å legge til flere vurderinger', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        harAvklaringsbehov={true}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    const begrunnelsesFelterFørDetErLagtTilEnNy = screen.getAllByRole('textbox', {
      name: 'Vurder om det skal gis barnetillegg for barnet',
    });

    expect(begrunnelsesFelterFørDetErLagtTilEnNy.length).toBe(1);

    const knapp = screen.getByRole('button', { name: 'Legg til vurdering' });
    await user.click(knapp);

    const begrunnelsesFelter = screen.getAllByRole('textbox', {
      name: 'Vurder om det skal gis barnetillegg for barnet',
    });

    expect(begrunnelsesFelter.length).toBe(2);
  });

  it('skal ikke være mulig å fjerne den første vurderinger', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        harAvklaringsbehov={true}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    expect(screen.queryByRole('button', { name: /fjern vurdering/i })).not.toBeInTheDocument();
  });

  it('knapp for å slette en vurdering skal vises dersom det legges til flere enn èn vurdering', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        harAvklaringsbehov={true}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    expect(
      screen.getAllByRole('textbox', {
        name: 'Vurder om det skal gis barnetillegg for barnet',
      }).length
    ).toBe(1);

    expect(screen.queryByRole('button', { name: /fjern vurdering/i })).not.toBeInTheDocument();

    const leggTilVurderingKnapp = screen.getByRole('button', { name: /legg til vurdering/i });
    await user.click(leggTilVurderingKnapp);

    expect(
      screen.getAllByRole('textbox', {
        name: 'Vurder om det skal gis barnetillegg for barnet',
      }).length
    ).toBe(2);

    expect(screen.getByRole('button', { name: /fjern vurdering/i })).toBeInTheDocument();
  });

  it('knapp for å legge til en ny vurdering skal ikke være synlig dersom det har blitt valgt nei på forsørgeransvar', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        harAvklaringsbehov={true}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    expect(screen.getByRole('button', { name: /legg til vurdering/i })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /nei/i }));

    expect(screen.queryByRole('button', { name: /legg til vurdering/i })).not.toBeInTheDocument();
  });

  it('skal vise dato felt når man besvarer nei på forsørgeransvar så lenge det ikke er første vurdering', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        harAvklaringsbehov={true}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    await user.click(screen.getByRole('radio', { name: /ja/i }));

    await user.click(screen.getByRole('button', { name: 'Legg til vurdering' }));

    await user.click(screen.getAllByRole('radio', { name: /nei/i })[1]);

    expect(screen.getByText('Forsørgeransvar opphører fra')).toBeInTheDocument();
  });

  it('skal ikke vise dato felt når man besvarer nei på forsørgeransvar i første vurdering', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        harAvklaringsbehov={true}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    await user.click(screen.getByRole('radio', { name: /nei/i }));

    expect(screen.queryByRole('Forsørgeransvar opphører fra')).not.toBeInTheDocument();
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
