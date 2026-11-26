import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';
import { DokumentInfo, Journalpost, Journalposttype, Journalstatus, Variantformat } from 'lib/types/journalpost';
import { SaksInfo } from 'lib/types/types';
import { describe, expect, it } from 'vitest';

import { HandlingerDokumentButton } from './HandlingerDokumentButton';

const sak: SaksInfo = {
  saksnummer: '12345',
  ident: '12345678910',
  opprettetTidspunkt: '2026-01-01T00:00:00',
  periode: { fom: '2026-01-01', tom: '2026-12-31' },
  status: 'UTREDES',
  behandlinger: [],
};

const dokument: DokumentInfo = {
  dokumentInfoId: 'dokument-1',
  tittel: 'Hoveddokument',
  dokumentvarianter: [
    { variantformat: Variantformat.ARKIV, saksbehandlerHarTilgang: false },
    { variantformat: Variantformat.ORIGINAL, saksbehandlerHarTilgang: true },
  ],
};

const vedlegg: DokumentInfo = {
  ...dokument,
  dokumentInfoId: 'dokument-2',
  tittel: 'Vedlegg',
};

function renderHandlinger(dokumenter: DokumentInfo[], seOriginalDokumentVariant = true) {
  const journalpost: Journalpost = {
    journalpostId: 'journalpost-1',
    journalposttype: Journalposttype.I,
    journalstatus: Journalstatus.JOURNALFOERT,
    tema: 'AAP',
    dokumenter,
  };

  render(
    <FeatureFlagProvider flags={{ ...mockedFlags, SeOriginalDokumentVariant: seOriginalDokumentVariant }}>
      <HandlingerDokumentButton sak={sak} journalpost={journalpost} />
    </FeatureFlagProvider>
  );

  return userEvent.setup();
}

describe('Original dokumentvariant', () => {
  it.each([
    { navn: 'ett dokument', dokumenter: [dokument] },
    { navn: 'flere dokumenter', dokumenter: [dokument, vedlegg] },
  ])('skjuler originalvalget når featureflagget er av og journalposten har $navn', async ({ dokumenter }) => {
    const user = renderHandlinger(dokumenter, false);

    await user.click(screen.getByRole('button', { name: 'Saksmeny' }));

    expect(screen.queryByRole('menuitem', { name: 'Original' })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Feilregistrer sakstilknytning' })).toBeVisible();
  });

  it('deaktiverer originalvalget når saksbehandler ikke har tilgang til originalvarianten', async () => {
    const user = renderHandlinger([
      {
        ...dokument,
        dokumentvarianter: [
          { variantformat: Variantformat.ARKIV, saksbehandlerHarTilgang: true },
          { variantformat: Variantformat.ORIGINAL, saksbehandlerHarTilgang: false },
        ],
      },
    ]);

    await user.click(screen.getByRole('button', { name: 'Saksmeny' }));

    expect(screen.getByRole('menuitem', { name: 'Original' })).toHaveAttribute('aria-disabled', 'true');
  });
});
