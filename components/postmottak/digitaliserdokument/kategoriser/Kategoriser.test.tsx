import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kategoriser } from './Kategoriser';

describe('Kategoriser', () => {
  it('Skal ha en tittel', () => {
    render(
      <Kategoriser
        submit={() => {}}
        kategori={'AKTIVITETSKORT'}
        readOnly={false}
        onKategoriChange={() => {}}
        status={undefined}
      />
    );
    const heading = screen.getByText('Kategoriser');
    expect(heading).toBeVisible();
  });
  it('Har et valg for å knytte dokumentet til sak', () => {
    render(
      <Kategoriser
        submit={() => {}}
        kategori={'AKTIVITETSKORT'}
        readOnly={false}
        onKategoriChange={() => {}}
        status={undefined}
      />
    );
    expect(screen.getByRole('combobox', { name: 'Velg kategori for dokument' })).toBeVisible();
  });
});
