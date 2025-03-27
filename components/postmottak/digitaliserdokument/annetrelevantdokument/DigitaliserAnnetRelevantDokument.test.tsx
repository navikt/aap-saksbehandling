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
    render(
      <DigitaliserAnnetRelevantDokument submit={() => {}} grunnlag={grunnlag} readOnly={false} isLoading={false} />
    );
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText(/Yrkesskade/));
    await user.click(screen.getByText(/Samordning og avregning/));

    const list = screen.getByRole('list');
    expect(within(list).getByText(/Yrkesskade/i)).toBeVisible();
    expect(within(list).getByText(/Samordning og avregning/i)).toBeVisible();
  });
});
