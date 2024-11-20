import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { DokumentInfo } from 'lib/types/types';

const dokumenter: DokumentInfo[] = [
  {
    datoOpprettet: '2024-12-12',
    dokumentInfoId: '123',
    erUtgående: false,
    journalpostId: '789',
    tittel: 'Mitt dokument',
    variantformat: 'ARKIV',
  },
];

describe('Tilknyttede dokumenter', () => {
  it('skal ha en tittel', () => {
    render(<TilknyttedeDokumenter valgteDokumenter={['789']} tilknyttedeDokumenterPåBehandling={dokumenter} />);
    const tittel = screen.getByText('Tilknyttede dokumenter');
    expect(tittel).toBeVisible();
  });

  it('skal vise dokumenter som er valgt', () => {
    render(<TilknyttedeDokumenter valgteDokumenter={['789']} tilknyttedeDokumenterPåBehandling={dokumenter} />);
    const dokument = screen.getByText(/mitt dokument/i);
    expect(dokument).toBeVisible();
  });

  it('skal vise tekst om at ingen dokumenter er valgt dersom ingen dokumenter er valgt', () => {
    render(<TilknyttedeDokumenter tilknyttedeDokumenterPåBehandling={dokumenter} />);
    const tekst = screen.getByText(/Ingen dokumenter er valgt/i);
    expect(tekst).toBeVisible();
  });
});
