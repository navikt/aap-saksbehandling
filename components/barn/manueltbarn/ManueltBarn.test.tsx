import { render, screen, within } from '@testing-library/react';
import { ManueltBarn, ManueltBarnType } from 'components/barn/manueltbarn/ManueltBarn';
import userEvent from '@testing-library/user-event';

const manueltBarn: ManueltBarnType = {
  navn: 'Kjell T Ringen',
  ident: '12345678910',
  rolle: 'FOSTERBARN',
};

describe('manuelleBarn', () => {
  const user = userEvent.setup();

  it('skal ha en heading med navn og ident', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);
    const heading = screen.getByRole('heading', { name: 'Kjell T Ringen - 12345678910' });
    expect(heading).toBeVisible();
  });

  it('skal ha en tekst under heading som forteller hvilken rolle barnet har', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);
    const rolle = screen.getByText('Fosterbarn');
    expect(rolle).toBeVisible();
  });

  it('skal ha en vilkårsveiledning med korrekt heading', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);
    const heading = screen.getByText('Slik vurderes vilkåret');
    expect(heading).toBeVisible();
  });

  it('skal ha innhold i vilkårsveiledningen', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);
    const tekst = screen.getByText('Her kommer det en tekst om hvordan vilkåret skal vurderes');
    expect(tekst).toBeVisible();
  });

  it('skal ha en lagre vurdering knapp', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);

    const lagreKnapp = screen.getByRole('button', { name: 'Lagre vurdering' });
    expect(lagreKnapp).toBeVisible();
  });

  it('skal ha et begrunnelsesfelt', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);
    const felt = screen.getByRole('textbox', {
      name: 'Vurder §11-20 og om det skal beregnes barnetillegg for dette barnet',
    });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding dersom begrunnelsesfelt ikke er besvart', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);

    const lagreKnapp = screen.getByRole('button', { name: 'Lagre vurdering' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Du må gi en begrunnelse');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt hvor det besvares om det skal beregnes barnetillegg for barnet', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);
    const felt = screen.getByRole('group', { name: 'Skal det beregnes barnetillegg for dette barnet?' });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding dersom feltet om det skal beregnes barnetillegg ikke er besvart', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);

    const lagreKnapp = screen.getByRole('button', { name: 'Lagre vurdering' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Du må besvare om det skal beregnes barnetillegg for barnet');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt for å sette datoen søkeren har forsørgeransvar for barnet fra dersom det har blitt besvart ja på spørsmålet om det skal beregnes barnetillegg', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);

    const forsørgerAnsvarFelt = screen.queryByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    expect(forsørgerAnsvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    const felt = screen.getByRole('textbox', { name: /søker har forsørgeransvar for barnet fra/i });
    expect(felt).toBeVisible();
  });

  it('skal ha vise feilmelding dersom feltet for datoen søkeren har forsørgeransvar for barnet fra ikke er besvart', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);

    const forsørgeransvarFelt = screen.queryByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    expect(forsørgeransvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const lagreKnapp = screen.getByRole('button', { name: 'Lagre vurdering' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Du må sette en dato for når søker har forsørgeransvar for barnet fra');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha en knapp for å kunne sette en sluttdato for forsørgeransvaret', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    const leggTilSluttDatoKnapp = screen.getByRole('button', { name: 'Legg til sluttdato' });
    expect(leggTilSluttDatoKnapp).toBeVisible();
  });

  it('skal vise felt for sluttdato for forsørgeransvare dersom man trykker på knappen legg til sluttdato', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    expect(screen.queryByRole('textbox', { name: /Sluttdato for forsørgeransvaret/i })).not.toBeInTheDocument();

    const leggTilSluttDatoKnapp = screen.getByRole('button', { name: 'Legg til sluttdato' });
    await user.click(leggTilSluttDatoKnapp);

    const sluttDatoFelt = screen.getByRole('textbox', { name: /Sluttdato for forsørgeransvaret/i });
    expect(sluttDatoFelt).toBeVisible();
  });

  async function svarJaPåOmDetSkalBeregnesBarnetillegg() {
    const skalBeregnesBarnetilleggFelt = screen.getByRole('group', {
      name: 'Skal det beregnes barnetillegg for dette barnet?',
    });
    const jaVerdi = within(skalBeregnesBarnetilleggFelt).getByRole('radio', { name: 'Ja' });

    await user.click(jaVerdi);
  }
});
