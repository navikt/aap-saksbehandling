import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { userEvent } from '@testing-library/user-event';

describe('Meldeplikt', () => {
  const user = userEvent.setup();

  it('skal være default lukket', () => {
    render(<Meldeplikt readOnly={false} behandlingVersjon={0} />);
    const textbox = screen.queryByRole('textbox', {
      name: 'Vurder om det vil være unødig tyngende for søker å overholde meldeplikten',
    });
    expect(textbox).toBeNull();
  });

  it('Skal ha en overskrift', () => {
    render(<Meldeplikt readOnly={false} behandlingVersjon={0} />);
    const heading = screen.getByRole('heading', { name: 'Unntak fra meldeplikt § 11-10' });
    expect(heading).toBeVisible();
  });

  it('Skal ha et begrunnelse felt', async () => {
    render(<Meldeplikt readOnly={false} behandlingVersjon={0} />);
    await openAccordionCard();

    const textbox = screen.getByRole('textbox', {
      name: /vurder om det vil være unødig tyngende for søker å overholde meldeplikten/i,
    });
    expect(textbox).toBeVisible();
  });

  it('Skal ha informasjonstekst om unntak fra meldeplikten', async () => {
    render(<Meldeplikt readOnly={false} behandlingVersjon={0} />);
    await openAccordionCard();

    expect(
      screen.getByRole('button', {
        name: 'Vilkåret skal kun vurderes ved behov. Se mer om vurdering av fritak fra meldeplikt',
      })
    ).toBeVisible();

    expect(screen.getByText('Unntak fra meldeplikten skal kun vurderes dersom saksbehandler:')).toBeVisible();
    expect(
      screen.getByText('Vurderer at det vil være unødig tyngende for søker å overholde meldeplikten')
    ).toBeVisible();
    expect(
      screen.getByText('Er usikker på om det vil være unødig tyngende for søker å overholde meldeplikten')
    ).toBeVisible();
  });

  it('Skal ha synlig vilkårsveiledning', async () => {
    render(<Meldeplikt readOnly={false} behandlingVersjon={0} />);
    await openAccordionCard();
    const vilkårsveiledning = screen.getByRole('button', { name: 'Slik vurderes dette' });
    expect(vilkårsveiledning).toBeVisible();
  });

  it('tabellen med oversikt over perioder har en rad initielt', async () => {
    render(<Meldeplikt readOnly={false} behandlingVersjon={0} />);
    await openAccordionCard();

    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('har en knapp for å legge til en ny periode', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await openAccordionCard();

    expect(screen.getByRole('button', { name: 'Legg til periode med fritak' })).toBeVisible();
  });

  describe('oppførsel', () => {
    it('når man klikker på knappen for å legge til en rad blir det lagt til en rad', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await openAccordionCard();

      expect(screen.getAllByRole('row')).toHaveLength(2);

      await leggTilRad();
      expect(screen.getAllByRole('row')).toHaveLength(3);
    });

    it('når man klikker på knappen for å slette en rad blir en rad slettet', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await openAccordionCard();
      await leggTilRad();
      const sisteSlettKnapp = screen.getAllByRole('button', { name: 'Slett' }).pop();
      expect(sisteSlettKnapp).not.toBeUndefined();
      if (sisteSlettKnapp) {
        await user.click(sisteSlettKnapp);
        expect(screen.getAllByRole('row')).toHaveLength(2);
      }
    });
  });
  describe('validering', () => {
    it('viser feilmelding dersom man ikke har begrunnet vurderingen', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await openAccordionCard();
      await klikkPåBekreft();
      expect(screen.getByText('Du må begrunne vurderingen din')).toBeVisible();
    });

    it('viser feilmelding derom man ikke har tatt stilling til om bruker skal ha fritak', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await openAccordionCard();
      await klikkPåBekreft();
      expect(
        screen.getByText('Du må ta stilling til om bruker skal ha fritak fra meldeplikten eller ikke')
      ).toBeVisible();
    });

    it('viser feilmelding hvis man har valgt at bruker skal ha fritak og ikke satt slutt-dato', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await openAccordionCard();
      await velgAtBrukerSkalHaFritak();

      await klikkPåBekreft();
      expect(screen.getByText('Du må legge inn en dato for når perioden slutter')).toBeVisible();
    });

    it('viser feilmelding når det legges inn en ugyldig dato', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await openAccordionCard();
      const fraDato = screen.getByRole('textbox', { name: 'Gjelder fra' });
      await user.type(fraDato, '31.02.2024');
      await klikkPåBekreft();
      expect(screen.getByText('Dato format er ikke gyldig. Dato må være på formatet dd.mm.yyyy')).toBeVisible();
    });

    // må skrives om litt
    it.skip('viser feilmelding dersom slutt-tidspunkt er før start-tidspunkt', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await openAccordionCard();
      await velgAtBrukerSkalHaFritak();
      const fraDato = screen.getByRole('textbox', { name: 'Gjelder fra' });
      const tilDato = screen.getByRole('textbox', { name: 'Til og med' });
      await user.type(fraDato, '21.02.2024');
      await user.type(tilDato, '20.02.2024');
      await klikkPåBekreft();
      expect(screen.getByText('Slutt-dato kan ikke være før start-dato')).toBeVisible();
    });

    it.skip('viser feilmelding dersom bruker har lagt inn overlappende perioder', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await openAccordionCard();
      await leggTilRad();
      const fritaksfelt = screen.getAllByRole('combobox', { name: 'Fritak meldeplikt' });
      await user.selectOptions(fritaksfelt[0], 'Ja');
      await user.selectOptions(fritaksfelt[1], 'Ja');

      const fraDatoFelt = screen.getAllByRole('textbox', { name: 'Gjelder fra' });
      const tilDatoFelt = screen.getAllByRole('textbox', { name: 'Til og med' });
      await user.type(fraDatoFelt[0], '01.01.2024');
      await user.type(tilDatoFelt[0], '15.01.2024');
      await user.type(fraDatoFelt[1], '14.01.2024');
      await user.type(tilDatoFelt[1], '30.01.2024');

      expect(screen.getByText('Perioder for fritak kan ikke overlappe.'));
    });
  });

  async function openAccordionCard() {
    const region = screen.getByRole('region', { name: /Unntak fra meldeplikt § 11-10/i });
    const button = within(region).getByRole('button');
    await user.click(button);
  }

  const leggTilRad = async () => await user.click(screen.getByRole('button', { name: 'Legg til periode med fritak' }));
  const klikkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
  const velgAtBrukerSkalHaFritak = async () =>
    await user.selectOptions(screen.getByRole('combobox', { name: 'Fritak meldeplikt' }), 'Ja');
});
