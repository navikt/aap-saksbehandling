import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'lib/test/CustomRender';
import { SøknadUtenlandsoppholdGrunnlagResponse } from 'lib/types/types';
import { VurderSøknadUtenlandsopphold } from 'components/behandlinger/utenlandsopphold/VurderSøknadUtenlandsopphold';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const user = userEvent.setup();

const grunnlag: SøknadUtenlandsoppholdGrunnlagResponse = {
  søknad: { journalpostId: '123', mottattDato: '2026-01-05' },
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_SØKNAD_UTENLANDSOPPHOLD' });
});

describe('Vurder søknad om AAP under opphold i utlandet', () => {
  it('viser opplysninger fra søknaden', () => {
    render(<VurderSøknadUtenlandsopphold behandlingVersjon={0} readOnly={false} grunnlag={grunnlag} />);

    expect(screen.getByText('05.01.2026')).toBeVisible();
  });

  it('skjuler godkjent periode og antall dager før resultat er valgt', () => {
    render(<VurderSøknadUtenlandsopphold behandlingVersjon={0} readOnly={false} grunnlag={grunnlag} />);

    expect(screen.queryByText('Antall godkjente dager')).not.toBeInTheDocument();
  });

  it('viser felt for godkjent periode når søknaden innvilges', async () => {
    render(<VurderSøknadUtenlandsopphold behandlingVersjon={0} readOnly={false} grunnlag={grunnlag} />);

    await user.click(screen.getByRole('radio', { name: 'Innvilget' }));

    expect(screen.getByText('Antall godkjente dager')).toBeVisible();
    expect(screen.getByText('Godkjent periode fra og med')).toBeVisible();
  });

  it('viser ikke felt for godkjent periode når søknaden avslås', async () => {
    render(<VurderSøknadUtenlandsopphold behandlingVersjon={0} readOnly={false} grunnlag={grunnlag} />);

    await user.click(screen.getByRole('radio', { name: 'Avslått' }));

    expect(screen.queryByText('Antall godkjente dager')).not.toBeInTheDocument();
  });

  it('gir feilmelding når begrunnelse mangler', async () => {
    render(<VurderSøknadUtenlandsopphold behandlingVersjon={0} readOnly={false} grunnlag={grunnlag} />);

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(await screen.findByText('Du må skrive en begrunnelse.')).toBeVisible();
    expect(screen.getByText('Du må velge et resultat.')).toBeVisible();
  });

  it('viser utkast og gjenoppretter feltene fra mellomlagringen', () => {
    render(
      <VurderSøknadUtenlandsopphold
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlag}
        initialMellomlagretVurdering={{
          avklaringsbehovkode: '4401',
          behandlingId: { id: 1 },
          data: '{"begrunnelse":"Mellomlagret begrunnelse","resultat":"AVSLÅTT"}',
          vurdertDato: '2026-01-06T12:00:00.000',
          vurdertAv: 'Jan T. Loven',
        }}
      />
    );

    expect(screen.getByText('Utkast lagret 06.01.2026 12:00 (Jan T. Loven)')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('Mellomlagret begrunnelse');
    expect(screen.getByRole('radio', { name: 'Avslått' })).toBeChecked();
  });
});
