import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dokument, Saksdokumenter } from 'components/saksdokumenter/Saksdokumenter';

const dokumenter: Dokument[] = [
  {
    navn: 'søknad.pdf',
    journalførtDato: '2025.12.12',
    dokumentId: '123',
    journalpostId: '456',
    type: 'sykemelding',
    ekstern: true,
  },
];

describe('saksdokumenter', () => {
  it('skal ha et felt for å kunne søke etter tittel på dokument', () => {
    render(<Saksdokumenter dokumenter={dokumenter} />);
    expect(screen.getByRole('textbox', { name: /søk i dokumenter/i })).toBeVisible();
  });

  it('skal ha et felt for å kunne søke type', () => {
    render(<Saksdokumenter dokumenter={dokumenter} />);
    expect(screen.getByRole('combobox', { name: /vis typer/i })).toBeVisible();
  });

  it('skal ha en tabell med x, x, x og x i header', () => {
    render(<Saksdokumenter dokumenter={dokumenter} />);
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
    render(<Saksdokumenter dokumenter={dokumenter} />);
    const innUtVerdi = screen.getByRole('img');
    const dokumentVerdi = screen.getByRole('link', { name: /søknad\.pdf/i });
    const typeVerdi = screen.getByRole('cell', { name: /sykemelding/i });
    const journalførtVerdi = screen.getByRole('cell', { name: /12\.12\.2025/i });

    expect(innUtVerdi).toBeVisible();
    expect(dokumentVerdi).toBeVisible();
    expect(typeVerdi).toBeVisible();
    expect(journalførtVerdi).toBeVisible();
  });
});
