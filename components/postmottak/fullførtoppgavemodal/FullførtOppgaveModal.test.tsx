import { render, screen } from 'lib/test/CustomRender';
import { expect, it } from 'vitest';
import { FullførtOppgaveModal } from './FullførtOppgaveModal';

it('viser egen fullføringstekst for Under18 uten å hevde at dokumentet er sendt', () => {
  render(<FullførtOppgaveModal typeBehandling="Under18" nesteBehandlingId={null} />);

  expect(screen.getByRole('heading', { name: 'Under 18-behandlingen er fullført' })).toBeVisible();
  expect(
    screen.getByText(
      'Behandlingen av søknaden for søkeren under 18 år er fullført i postmottak. Gå tilbake til oppgavelisten for å starte på neste oppgave.'
    )
  ).toBeVisible();
  expect(screen.getByRole('button', { name: 'Gå til oppgavelisten' })).toBeVisible();
  expect(screen.queryByText('Dokumentet er kategorisert og sendt.')).not.toBeInTheDocument();
});

it('beholder teksten og neste handling for journalføring med dokumenthåndtering', () => {
  render(<FullførtOppgaveModal typeBehandling="Journalføring" nesteBehandlingId="dokument" />);

  expect(screen.getByRole('heading', { name: 'Dokumentet er journalført' })).toBeVisible();
  expect(screen.getByText(/det har blitt opprettet en ny oppgave for å digitalisere dokumentet/)).toBeVisible();
  expect(screen.getByRole('button', { name: 'Start digitalisering av dokumentet' })).toBeVisible();
});

it('beholder fullføringsteksten for dokumenthåndtering', () => {
  render(<FullførtOppgaveModal typeBehandling="DokumentHåndtering" nesteBehandlingId={null} />);

  expect(screen.getByRole('heading', { name: 'Dokumentet er kategorisert og sendt.' })).toBeVisible();
  expect(screen.getByText('Gå tilbake til oppgavelisten for å starte på neste oppgave.')).toBeVisible();
});
