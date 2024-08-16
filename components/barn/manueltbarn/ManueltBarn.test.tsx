import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ManueltBarn } from 'components/barn/manueltbarn/ManueltBarn';
import { userEvent } from '@testing-library/user-event';
import { addDays } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { OppgitteBarn } from 'lib/types/types';

const manueltBarn: OppgitteBarn = {
  identifikator: '12345678910',
  aktivIdent: true,
};

describe('Manuelt registrerte barn', () => {
  const user = userEvent.setup();

  // TODO navn må hentes, kommer ikke som en del av grunnlaget
  it.skip('skal ha en heading med navn og ident', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);
    const heading = screen.getByRole('heading', { name: 'Kjell T Ringen - 12345678910' });
    expect(heading).toBeVisible();
  });

  it('skal ha en vilkårsveiledning med korrekt heading', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);
    const heading = screen.getByText('Slik vurderes vilkåret');
    expect(heading).toBeVisible();
  });

  it('skal ha innhold i vilkårsveiledningen', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);
    const tekst = screen.getByText('Her kommer det en tekst om hvordan vilkåret skal vurderes');
    expect(tekst).toBeVisible();
  });

  it('skal ha et begrunnelsesfelt', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);
    const felt = screen.getByRole('textbox', {
      name: 'Vurder §11-20 og om det skal beregnes barnetillegg for dette barnet',
    });
    expect(felt).toBeVisible();
  });

  // denne testen må skrives om
  it.skip('skal gi en feilmelding dersom begrunnelsesfelt ikke er besvart', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);

    const lagreKnapp = screen.getByRole('button', { name: 'Lagre vurdering' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Du må gi en begrunnelse');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt hvor det besvares om det skal beregnes barnetillegg for barnet', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);
    const felt = screen.getByRole('group', { name: 'Skal det beregnes barnetillegg for dette barnet?' });
    expect(felt).toBeVisible();
  });

  // denne testes må skrives om
  it.skip('skal gi en feilmelding dersom feltet om det skal beregnes barnetillegg ikke er besvart', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);

    const lagreKnapp = screen.getByRole('button', { name: 'Lagre vurdering' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Du må besvare om det skal beregnes barnetillegg for barnet');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt for å sette datoen søkeren har forsørgeransvar for barnet fra dersom det har blitt besvart ja på spørsmålet om det skal beregnes barnetillegg', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);

    const forsørgerAnsvarFelt = screen.queryByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    expect(forsørgerAnsvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    const felt = screen.getByRole('textbox', { name: /søker har forsørgeransvar for barnet fra/i });
    expect(felt).toBeVisible();
  });

  // denne testen må skrives om
  it.skip('skal ha vise feilmelding dersom feltet for datoen søkeren har forsørgeransvar for barnet fra ikke er besvart', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);

    const forsørgeransvarFelt = screen.queryByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    expect(forsørgeransvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const lagreKnapp = screen.getByRole('button', { name: 'Lagre vurdering' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Du må sette en dato for når søker har forsørgeransvar for barnet fra');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha en knapp for å kunne sette en sluttdato for forsørgeransvaret', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    const leggTilSluttDatoKnapp = screen.getByRole('button', { name: 'Legg til sluttdato' });
    expect(leggTilSluttDatoKnapp).toBeVisible();
  });

  it('skal vise felt for sluttdato for forsørgeransvare dersom man trykker på knappen legg til sluttdato', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    expect(screen.queryByRole('textbox', { name: /Sluttdato for forsørgeransvaret/i })).not.toBeInTheDocument();

    const leggTilSluttDatoKnapp = screen.getByRole('button', { name: 'Legg til sluttdato' });
    await user.click(leggTilSluttDatoKnapp);

    const sluttDatoFelt = screen.getByRole('textbox', { name: /Sluttdato for forsørgeransvaret/i });
    expect(sluttDatoFelt).toBeVisible();
  });

  // denne testen må skrives om
  it.skip('gir en feilmelding dersom det legges inn en dato frem i tid for når søker har foreldreansvar fra', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const datofelt = screen.getByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });
    const imorgen = addDays(new Date(), 1);

    await user.type(datofelt, formaterDatoForFrontend(imorgen));
    const lagreKnapp = screen.getByRole('button', { name: 'Lagre vurdering' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Dato for når søker har forsørgeransvar fra kan ikke være frem i tid');
    expect(feilmelding).toBeVisible();
  });

  // denne testen må skrives om
  it.skip('gir en feilmelding dersom det legges inn en ugyldig verdi for når søker har foreldreansvar fra', async () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={false} />);
    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const datofelt = screen.getByRole('textbox', { name: 'Søker har forsørgeransvar for barnet fra' });

    await user.type(datofelt, '12.2003');
    const lagreKnapp = screen.getByRole('button', { name: 'Lagre vurdering' });

    await user.click(lagreKnapp);
    const feilmelding = screen.getByText('Dato for når søker har forsørgeransvar fra er ikke gyldig');
    expect(feilmelding).toBeVisible();
  });

  it('skal ikke vise knapp for å fullføre vurdering dersom readonly er satt til true', () => {
    render(<ManueltBarn manueltBarn={manueltBarn} readOnly={true} />);
    const knapp = screen.queryByRole('button', { name: 'Lagre vurdering' });
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
