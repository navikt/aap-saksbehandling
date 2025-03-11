import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DigitaliserAnnetRelevantDokument } from './DigitaliserAnnetRelevantDokument';

const grunnlag: DigitaliseringsGrunnlag = {
  erPapir: false,
  vurdering: {
    kategori: 'ANNET_RELEVANT_DOKUMENT',
    strukturertDokumentJson: '{}',
  },
};

describe('DigitaliserAnnetDokument', () => {
  const user = userEvent.setup();

  it('at det går an å velge flere alternativer', async () => {
    render(<DigitaliserAnnetRelevantDokument submit={() => {}} grunnlag={grunnlag} readOnly={false} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText(/Mottatt søknad/));
    await user.click(screen.getByText(/Mottatt meldekort/));

    const list = screen.getByRole('list');
    expect(within(list).getByText(/Mottatt søknad/i)).toBeVisible();
    expect(within(list).getByText(/Mottatt meldekort/i)).toBeVisible();
  });
});
