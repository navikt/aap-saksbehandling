import { beforeEach, describe, expect, test } from 'vitest';
import { Soningsvurdering } from 'components/behandlinger/etannetsted/soning/Soningsvurdering';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SoningsgrunnlagResponse } from 'lib/types/types';

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

  test('viser kun spørsmål om søker gjennomfører straff utenfor fengsel initielt', () => {
    expect(screen.getByRole('group', { name: 'Gjennomfører søker straff utenfor fengsel?' })).toBeVisible();
    expect(
      screen.queryByText('Skriv en beskrivelse av hvorfor det er vurdert at søker gjennomfører straff utenfor fengsel')
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Har søker arbeid utenfor institusjonen?' })).not.toBeInTheDocument();
  });

  test('viser feilmelding dersom man ikke har svart på om søker soner straff i fengsel', async () => {
    await user.click(screen.getByText('Bekreft'));

    expect(screen.getByText('Du må oppgi om søker soner straff i eller utenfor fengsel')).toBeVisible();
  });

  test('viser begrunnelsesfelt når straff sones utenfor fengsel', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByRole('radio', { name: 'Ja' }));

    expect(
      screen.getByText('Skriv en beskrivelse av hvorfor det er vurdert at søker gjennomfører straff utenfor fengsel')
    ).toBeVisible();
  });

  test('viser feilmelding dersom begrunnelse for vurderingen av soning utenfor fengsel ikke er besvart', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByText('Ja'));
    await user.click(screen.getByText('Bekreft'));

    expect(
      screen.getByText('Du må begrunne hvorfor det er vurdert at søker gjennomfører straff utenfor fengsel')
    ).toBeVisible();
  });

  test('viser valg for om søker har arbeid utenfor institusjonen når straff gjennomføres i fengsel', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByRole('radio', { name: 'Nei' }));

    expect(screen.getByRole('group', { name: 'Har søker arbeid utenfor institusjonen?' })).toBeVisible();
  });

  test('Spørsmål om arbeid utenfor institusjon må besvares', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByRole('radio', { name: 'Nei' }));
    await user.click(screen.getByText('Bekreft'));

    expect(screen.getByText('Du må svare på om søker har arbeid utenfor institusjonen')).toBeVisible();
  });

  test('viser begrunnelsesfelt når søker arbeider utenfor institusjonen', async () => {
    const straffUtenforFengselSpørsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpørsmål).getByRole('radio', { name: 'Nei' }));

    const arbeidUtenforFengselSpærsmål = screen.getByRole('group', { name: 'Har søker arbeid utenfor institusjonen?' });
    await user.click(within(arbeidUtenforFengselSpærsmål).getByRole('radio', { name: 'Ja' }));

    expect(
      screen.getByText('Skriv en beskrivelse av hvorfor det er vurdert at søker har arbeid utenfor institusjonen')
    ).toBeVisible();
  });

  test('dersom søker jobber utenfor institusjon må dato for første arbeidsdag registreres', async () => {
    const straffUtenforFengselSpørsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpørsmål).getByRole('radio', { name: 'Nei' }));

    const arbeidUtenforFengselSpærsmål = screen.getByRole('group', { name: 'Har søker arbeid utenfor institusjonen?' });
    await user.click(within(arbeidUtenforFengselSpærsmål).getByRole('radio', { name: 'Ja' }));
    expect(screen.getByRole('textbox', { name: 'Dato for første arbeidsdag' })).toBeVisible();
  });

  test('gir feilmelding dersom dato for første arbeidsdag ikke er besvart', async () => {
    const straffUtenforFengselSpærsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpærsmål).getByRole('radio', { name: 'Nei' }));

    const arbeidUtenforFengselSpørsmål = screen.getByRole('group', { name: 'Har søker arbeid utenfor institusjonen?' });
    await user.click(within(arbeidUtenforFengselSpørsmål).getByRole('radio', { name: 'Ja' }));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(screen.getByText('Dato for første arbeidsdag må registreres')).toBeVisible();
  });

  test('gir feilmelding dersom man ikke begrunner hvorfor det er vurdert at søker har arbeid utenfor institusjonen', async () => {
    const straffUtenforFengselSpørsmål = screen.getByRole('group', {
      name: 'Gjennomfører søker straff utenfor fengsel?',
    });
    await user.click(within(straffUtenforFengselSpørsmål).getByRole('radio', { name: 'Nei' }));

    const arbeidUtenforFengselSpørsmål = screen.getByRole('group', { name: 'Har søker arbeid utenfor institusjonen?' });
    await user.click(within(arbeidUtenforFengselSpørsmål).getByRole('radio', { name: 'Ja' }));

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(
      screen.getByText('Du må begrunne hvorfor det er vurdert at søker har arbeid utenfor institusjonen')
    ).toBeVisible();
  });
});
