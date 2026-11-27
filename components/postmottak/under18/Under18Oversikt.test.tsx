import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Under18Grunnlag } from 'lib/types/postmottakTypes';
import { Under18Oversikt } from './Under18Oversikt';

it('beholder dokumentenes egne tilstander og lenker etter at Under18 er avsluttet', () => {
  const behandling: Under18Grunnlag['behandling'] = {
    aktivtSteg: 'IVERKSETTES',
    status: 'AVSLUTTET',
    referanse: 'forelder',
    versjon: 3,
    åpneBehov: [],
    vent: [],
    prosesseringFeilet: false,
  };
  render(
    <Under18Oversikt
      grunnlag={{
        behandling,
        søknader: [
          { journalpostId: 10 },
          {
            journalpostId: 11,
            tilknyttetJournalpostId: 12,
            dokumentbehandling: {
              ...behandling,
              referanse: 'dokument',
              status: 'UTREDES',
              aktivtSteg: 'DIGITALISER_DOKUMENT',
            },
          },
        ],
      }}
    />
  );
  expect(screen.getByText('Avsluttet i postmottak')).toBeVisible();
  expect(screen.getByText('Ingen dokumentbehandling opprettet')).toBeVisible();
  expect(screen.getByText('Digitalisering')).toBeVisible();
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.getByRole('link', { name: /journalpost 11/ })).toHaveAttribute('href', '/postmottak/dokument');
});
