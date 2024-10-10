import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Saksdokumenter } from 'components/saksdokumenter/Saksdokumenter';
import { DokumentInfo } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';

const etDokument: DokumentInfo[] = [
  {
    tittel: 'søknad.pdf',
    dokumentInfoId: '123',
    journalpostId: '456',
    variantformat: 'ARKIV',
    brevkode: 'arkiv',
    datoOpprettet: '2024-12-12',
    erUtgående: true,
  },
];

const toDokument: DokumentInfo[] = [
  {
    tittel: 'søknad.pdf',
    dokumentInfoId: '123',
    journalpostId: '456',
    variantformat: 'ARKIV',
    brevkode: 'arkiv',
    datoOpprettet: '2024-12-12',
    erUtgående: true,
  },
  {
    tittel: 'legeerklæring.pdf',
    dokumentInfoId: '456',
    journalpostId: '789',
    variantformat: 'ARKIV',
    brevkode: 'arkiv',
    datoOpprettet: '2024-12-12',
    erUtgående: true,
  },
];

describe('saksdokumenter', () => {
  const user = userEvent.setup();

  it('skal ha et felt for å kunne søke etter tittel på dokument', () => {
    render(<Saksdokumenter dokumenter={etDokument} />);
    expect(screen.getByRole('textbox', { name: /søk i dokumenter/i })).toBeVisible();
  });

  it('skal ha et felt for å kunne søke type', () => {
    render(<Saksdokumenter dokumenter={etDokument} />);
    expect(screen.getByRole('combobox', { name: /vis typer/i })).toBeVisible();
  });

  it('skal ha en tabell med inn/ut, dokument, type og journalført i header', () => {
    render(<Saksdokumenter dokumenter={etDokument} />);
    const innUt = screen.getByRole('columnheader', { name: /inn \/ ut/i });
    const dokument = screen.getByRole('columnheader', { name: /dokument/i });
    const type = screen.getByRole('columnheader', { name: /type/i });
    const journalført = screen.getByRole('columnheader', { name: /journalført/i });

    expect(innUt).toBeVisible();
    expect(dokument).toBeVisible();
    expect(type).toBeVisible();
    expect(journalført).toBeVisible();
  });

  it('skal ha en rad med verdier', () => {
    render(<Saksdokumenter dokumenter={etDokument} />);
    const innUtVerdi = screen.getByRole('img');
    const dokumentVerdi = screen.getByRole('link', { name: /søknad\.pdf/i });
    const typeVerdi = screen.getByRole('cell', { name: /arkiv/i });
    const journalførtVerdi = screen.getByRole('cell', { name: /12\.12\.2024/i });

    expect(innUtVerdi).toBeVisible();
    expect(dokumentVerdi).toBeVisible();
    expect(typeVerdi).toBeVisible();
    expect(journalførtVerdi).toBeVisible();
  });

  it('skal være mulig å søke etter et dokument', async () => {
    render(<Saksdokumenter dokumenter={toDokument} />);
    expect(screen.getByRole('link', { name: /søknad\.pdf/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /legeerklæring\.pdf/i })).toBeVisible();

    const søkefelt = screen.getByRole('textbox', { name: /søk i dokumenter/i });

    await user.type(søkefelt, 'sø');

    expect(screen.getByRole('link', { name: /søknad\.pdf/i })).toBeVisible();
    expect(screen.queryByRole('link', { name: /legeerklæring\.pdf/i })).not.toBeInTheDocument();
  });
});
