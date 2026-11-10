import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'lib/test/CustomRender';
import { SøknadUtenlandsoppholdGrunnlagResponse } from 'lib/types/types';
import { BekreftBrevSendt } from 'components/behandlinger/utenlandsopphold/BekreftBrevSendt';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const user = userEvent.setup();

const grunnlag: SøknadUtenlandsoppholdGrunnlagResponse = {
  søknad: { journalpostId: '123', mottattDato: '2026-01-05' },
  vurdering: {
    land: 'SE',
    resultat: 'INNVILGET',
    søknadsperiode: { fom: '2026-02-01', tom: '2026-02-14' },
    godkjentPeriode: { fom: '2026-02-01', tom: '2026-02-14' },
    begrunnelse: 'Ferie i Sverige',
    vurderingerMeta: { vurdertAv: { ident: 'Z123456', dato: '2026-01-06', kilde: 'SAKSBEHANDLER' } },
  },
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'BEKREFT_BREV_SENDT' });
});

describe('Bekreft brev sendt', () => {
  it('viser kortet og en avkrysning som må krysses av', () => {
    render(<BekreftBrevSendt behandlingVersjon={0} readOnly={false} grunnlag={grunnlag} />);

    expect(screen.getByText('Bekreft at brev er sendt')).toBeVisible();
    expect(screen.getByRole('checkbox', { name: /brev om vedtaket er sendt/i })).not.toBeChecked();
  });

  it('gir feilmelding når brevet ikke er bekreftet sendt', async () => {
    render(<BekreftBrevSendt behandlingVersjon={0} readOnly={false} grunnlag={grunnlag} />);

    await user.click(screen.getByRole('button', { name: 'Bekreft og avslutt' }));

    expect(await screen.findByText('Du må bekrefte at brevet er sendt før behandlingen kan avsluttes.')).toBeVisible();
  });
});
