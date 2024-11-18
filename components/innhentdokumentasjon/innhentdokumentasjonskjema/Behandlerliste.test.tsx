import { render, screen } from '@testing-library/react';
import { Behandlerliste } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/Behandlerliste';
import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { describe, expect, test, vi } from 'vitest';

const behandlere: Behandler[] = [
  {
    behandlerRef: '1234',
    fornavn: 'John',
    mellomnavn: 'J. D.',
    etternavn: 'Dorian',
  },
];

describe('Behandlerliste', () => {
  test('viser en liste med behandlere', () => {
    render(<Behandlerliste behandlere={behandlere} velgBehandler={() => vi.fn()} />);
    expect(screen.getByText('John J. D. Dorian')).toBeVisible();
  });

  test('viser ingenting dersom listen er undefined', () => {
    render(<Behandlerliste behandlere={undefined} velgBehandler={() => vi.fn()} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('viser en melding om ingen treff når listen er tom', () => {
    render(<Behandlerliste behandlere={[]} velgBehandler={() => vi.fn()} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getByText('Ingen treff')).toBeVisible();
  });
});
