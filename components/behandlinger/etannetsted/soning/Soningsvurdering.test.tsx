import { describe, test, expect, beforeEach } from 'vitest';
import { Soningsvurdering } from 'components/behandlinger/etannetsted/soning/Soningsvurdering';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SoningsgrunnlagResponse } from '../../../../lib/types/types';

const user = userEvent.setup();

describe('Soningsvurdering', () => {
  beforeEach(() => {
    render(
      <Soningsvurdering
        behandlingsreferanse={'smooth-reference'}
        behandlingVersjon={0}
        grunnlag={{ soningsopphold: [] } as SoningsgrunnlagResponse}
        readOnly={false}
      />
    );
  });

  test('har overskrift Soningsvurdering § 11-26', () => {
    expect(screen.getByRole('heading', { name: 'Soning § 11-26', level: 3 })).toBeVisible();
  });

  test('viser melding om at søker har soningsforhold', () => {
    expect(screen.getByText('Vi har fått informasjon om at søker har soningsforhold')).toBeVisible();
  });

  describe('vedleggspanel', () => {
    test('har en liste over dokumenter som kan tilknyttes vurderingen', () => {
      const tilknyttedeDokumenterListe = screen.getByRole('group', {
        name: 'Dokumenter funnet som er relevante for vurdering av AAP under straffegjennomføring §11-26',
      });
      expect(tilknyttedeDokumenterListe).toBeVisible();
    });

    test('listen over dokumenter har korrekt beskrivelse', () => {
      expect(screen.getByText('Les dokumentene og tilknytt eventuelt dokumenter til 11-26 vurderingen')).toBeVisible();
    });

    // TODO: Test feiler fordi dokumenterBruktIVurdering ikke blir oppdatert når testen kjører, fungerer i nettleser.
    // Fiks test når vi faktisk skal bruke dokumentlisten
    test.skip('skal vise en liste med tilknyttede dokumenter som har blitt valgt', async () => {
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
  });

  test('Spørsmål om soning i eller utenfor anstalt må være besvart', async () => {
    await user.click(screen.getByText('Bekreft'));

    expect(screen.getByText('Du må oppgi om søker soner straff i eller utenfor fengsel')).toBeVisible();
  });

  test('Dersom straff sones utenfor fengsel skal begrunnelsestekstfelt vises', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByText('Ja'));

    expect(
      screen.getByText('Skriv en beskrivelse av hvorfor det er vurdert at søker gjennomfører straff utenfor fengsel')
    ).toBeVisible();
  });

  test('Dersom straff sones utenfor fengsel må begrunnelsestekstfelt fylles ut', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByText('Ja'));
    await user.click(screen.getByText('Bekreft'));

    expect(screen.getByText('En begrunnelse for soning utenfor fengsel må oppgis')).toBeVisible();
  });

  test('Dersom straff sones i fengsel skal valg for arbeid utenfor anstalt vises', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByText('Nei'));

    expect(screen.getByText('Har søkerarbeid utenfor anstalten?')).toBeVisible();
  });

  test('Spørsmål om arbeid utenfor anstalt må besvares', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByText('Nei'));
    await user.click(screen.getByText('Bekreft'));

    expect(screen.getByText('Spørsmål må besvares')).toBeVisible();
  });

  test('Dersom søker jobber utenfor anstalt skals begrunnelse-tekstfelt vises', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByText('Nei'));

    const arbeidUtenforFengselSpærsmål = screen.getByRole('group', { name: 'Har søkerarbeid utenfor anstalten?' });
    await user.click(within(arbeidUtenforFengselSpærsmål).getByText('Ja'));

    expect(
      screen.getByText('Skriv en beskrivelse av hvorfor det er vurdert at søker har arbeid utenforanstalt?')
    ).toBeVisible();
  });

  test('Beskrivesle av arbeid utenfor anstalt må oppgis', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByText('Nei'));

    const arbeidUtenforFengselSpærsmål = screen.getByRole('group', { name: 'Har søkerarbeid utenfor anstalten?' });
    await user.click(within(arbeidUtenforFengselSpærsmål).getByText('Ja'));

    await user.click(screen.getByText('Bekreft'));

    expect(screen.getByText('Beskrivelse må fylles ut')).toBeVisible();
  });
});
