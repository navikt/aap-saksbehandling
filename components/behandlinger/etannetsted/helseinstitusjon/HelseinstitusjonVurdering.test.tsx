import { describe, it, test, beforeEach, expect } from 'vitest';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/etannetsted/helseinstitusjon/Helseinstitusjonsvurdering';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelseinstitusjonGrunnlagResponse } from 'lib/types/types';

const user = userEvent.setup();

describe('Helseinstitusjonsvurdering', () => {
  const helseinstitusjonGrunnlag: HelseinstitusjonGrunnlagResponse = {
    helseinstitusjonGrunnlag: undefined,
    helseinstitusjonOpphold: [
      {
        oppholdFra: '2021-01-01',
        institusjonstype: 'Sykehus',
        oppholdstype: 'Heldøgnspasient',
        status: 'Aktivt',
        kildeinstitusjon: 'Godthaab',
      },
    ],
  };
  beforeEach(() => {
    render(<Helseinstitusjonsvurdering grunnlag={helseinstitusjonGrunnlag} behandlingVersjon={0} readOnly={false} />);
  });

  test('har overskrift Helseinstitusjon § 11-25', () => {
    expect(screen.getByRole('heading', { name: 'Helseinstitusjon § 11-25', level: 3 })).toBeVisible();
  });

  test('viser en melding om at det er oppdaget institusjonsopphold som kan påvirke ytelsen', () => {
    expect(
      screen.getByText('Vi har funnet en eller flere registrerte opphold på helseinstitusjon som kan påvirke ytelsen')
    ).toBeVisible();
  });

  test('har en liste over dokumenter som kan tilknyttes vurderingen', () => {
    const tilknyttedeDokumenterListe = screen.getByRole('group', {
      name: 'Søker har opphold på helseinstitusjon over 3 mnd. Vurder om ytelsen skal reduseres',
    });
    expect(tilknyttedeDokumenterListe).toBeVisible();
  });

  test('listen over dokumenter har korrekt beskrivelse', () => {
    expect(
      screen.getByText('Les dokumentene og tilknytt relevante dokumenter til vurdering om ytelsen skal reduseres')
    ).toBeVisible();
  });

  // TODO: Test feiler fordi dokumenterBruktIVurdering ikke blir oppdatert når testen kjører, fungerer i nettleser.
  // Fiks test når vi faktisk skal bruke dokumentlisten
  it.skip('skal vise en liste med tilknyttede dokumenter som har blitt valgt', async () => {
    const rad = screen.getByRole('row', {
      name: /^Sykemelding/,
    });

    await user.click(
      within(rad).getByRole('checkbox', {
        name: 'Tilknytt dokument til vurdering',
      })
    );

    const list = screen.getByRole('list', {
      name: 'Tilknyttede dokumenter',
    });

    const dokument = within(list).getByText('Sykemelding');
    expect(dokument).toBeVisible();
  });

  test('viser en liste over institusjonsopphold som er oppdaget', () => {
    expect(
      screen.getByRole('table', { name: 'Søker har følgende institusjonsopphold på helseinstitusjon' })
    ).toBeVisible();
  });

  test('har et fritekstfelt for vurdering av vilkåret', () => {
    expect(
      screen.getByRole('textbox', { name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen' })
    ).toBeVisible();
  });

  test('spør om søker får fri kost og losji', () => {
    expect(screen.getByRole('group', { name: 'Får søker fri kost og losji?' })).toBeVisible();
  });

  test('spørsmål om søker forsørger ektefelle vises ikke initielt', () => {
    expect(screen.queryByRole('group', { name: 'Forsørger søker ektefelle?' })).not.toBeInTheDocument();
  });

  test('viser ikke spørsmål om søker forsørger ektefelle når man svarer nei på at søker får fri kost og losji', async () => {
    await user.click(screen.getByRole('radio', { name: 'Nei' }));
    expect(screen.queryByRole('group', { name: 'Forsørger søker ektefelle?' })).not.toBeInTheDocument();
  });

  test('viser spørsmål om søker forsørger ektefelle når man svarer ja på at søker får fri kost og losji', async () => {
    await user.click(screen.getByRole('radio', { name: 'Ja' }));

    expect(screen.getByRole('group', { name: 'Forsørger søker ektefelle?' })).toBeVisible();
  });

  test('spørsmål om søker har faste utgifter vises ikke initielt', () => {
    expect(
      screen.queryByRole('group', { name: 'Har søker faste utgifter nødvendig for å beholde bolig og annet?' })
    ).not.toBeInTheDocument();
  });

  test('viser ikke spørsmål om søker har faste utgifter når man svarer nei på at søker får fri kost og losji', async () => {
    await user.click(screen.getByRole('radio', { name: 'Nei' }));
    expect(
      screen.queryByRole('group', { name: 'Har søker faste utgifter nødvendig for å beholde bolig og annet?' })
    ).not.toBeInTheDocument();
  });

  test('viser spørsmål om søker har faste utgifer når man svarer ja på at søker får fri kost og losji', async () => {
    await user.click(screen.getByRole('radio', { name: 'Ja' }));
    expect(
      screen.queryByRole('group', { name: 'Har søker faste utgifter nødvendig for å beholde bolig og annet?' })
    ).toBeVisible();
  });

  describe('valiering', () => {
    test('viser feilmelding dersom begrunnelse ikke er fylt ut', async () => {
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må begrunne vurderingen din')).toBeVisible();
    });

    test('viser feilmelding hvis man ikke har svart på om søker får fri kost og losji', async () => {
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må svare på om søker får fri kost og losji')).toBeVisible();
    });
    test('når søker får fri kost og losji vises det en feilmelding hvis man ikke har svart på om søker forsørger ektefelle', async () => {
      await user.click(screen.getByRole('radio', { name: 'Ja' }));
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må svare på om søker forsørger ektefelle')).toBeVisible();
    });

    test('når søker får fri kost og losji vises det en feilmelding hvis man ikke har svart på om søker har faste utgifter', async () => {
      await user.click(screen.getByRole('radio', { name: 'Ja' }));
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(
        screen.getByText('Du må svare på om søker har faste utgifter nødvendig for å beholde bolig og annet')
      ).toBeVisible();
    });
  });
});
