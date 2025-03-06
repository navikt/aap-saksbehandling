import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('skal kunne velge årsak', async () => {
    render(<DigitaliserAnnetRelevantDokument submit={() => {}} grunnlag={grunnlag} readOnly={false} />);
    const årsakFelt = screen.getByRole('combobox', { name: /Velg en årsak/i });
    expect(årsakFelt).toBeVisible();
    expect(årsakFelt).toHaveValue('');

    await user.selectOptions(årsakFelt, 'SØKNAD');
    expect(årsakFelt).toHaveValue('SØKNAD');
  });
});
