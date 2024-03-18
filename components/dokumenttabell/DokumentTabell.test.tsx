import { render, screen } from '@testing-library/react';
import { Dokument, DokumentTabell } from './DokumentTabell';
import { formaterDato } from 'lib/utils/date';

import { DokumentTabellRad } from 'components/dokumenttabell/DokumentTabellRad';

const dokumenter: Dokument[] = [
  {
    journalpostId: '123',
    dokumentId: '123',
    tittel: 'Tittel',
    åpnet: new Date(),
    erTilknyttet: false,
  },
];

describe('DokumentTabell', () => {
  it('Skal rendre en tabell', () => {
    render(<DokumentTabell dokumenter={dokumenter} />);
    const headers = ['Dokument', 'Journalpostid', 'Åpnet', 'Tilknytt dokument til vurdering'];
    headers.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: new RegExp(`^${header}$`) })).toBeVisible();
    });
  });

  it('Skal rendre en rad per dokument', () => {
    render(<DokumentTabell dokumenter={dokumenter} />);
    expect(screen.getAllByRole('row')).toHaveLength(2); // Inkluderer table header row
  });

  it('skal ha en knapp for å legge til et nytt dokument', () => {
    render(<DokumentTabell dokumenter={dokumenter} />);
    const knapp = screen.getByRole('button', { name: /Legg til dokument/i });
    expect(knapp).toBeVisible();
  });

  it('Skal ha et felt for om dokumentasjon mangler', () => {
    render(<DokumentTabell dokumenter={dokumenter} />);
    const dokumentasjonManglerCheckbox = screen.getByRole('checkbox', { name: /dokumentasjon mangler/i });
    expect(dokumentasjonManglerCheckbox).toBeVisible();
  });
});

describe('DokumentTabellRow', () => {
  it('Skal rendre en rad med dokument', () => {
    const dokument = dokumenter[0];
    render(
      <table>
        <tbody>
          <DokumentTabellRad dokument={dokument} />
        </tbody>
      </table>
    );
    expect(screen.getByRole('row')).toBeVisible();
    expect(screen.getByRole('link', { name: dokument.tittel })).toBeVisible();
    expect(screen.getByRole('cell', { name: dokument.journalpostId })).toBeVisible();
    expect(screen.getByRole('cell', { name: formaterDato(dokument.åpnet ?? new Date()) })).toBeVisible();
    expect(screen.getByRole('checkbox')).toBeVisible();
  });
});
