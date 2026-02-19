import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DigitaliserAnnetRelevantDokument } from './DigitaliserAnnetRelevantDokument';

const grunnlag: DigitaliseringsGrunnlag = {
  klagebehandlinger: [],
  erPapir: false,
  vurdering: {
    kategori: 'ANNET_RELEVANT_DOKUMENT',
    strukturertDokumentJson: '{}',
  },
};

describe('DigitaliserAnnetDokument', () => {
  const user = userEvent.setup();

  it('at det går an å velge flere alternativer', async () => {
    const submit = vi.fn(() => {});

    render(<DigitaliserAnnetRelevantDokument submit={submit} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText(/Yrkesskade/));
    await user.click(screen.getByText(/Samordning og avregning/));

    const list = screen.getByRole('list');
    expect(within(list).getByText(/Yrkesskade/i)).toBeVisible();
    expect(within(list).getByText(/Samordning og avregning/i)).toBeVisible();

    // Submitter før begrunnelse
    await user.click(screen.getByRole('button', { name: /Send inn/ }));
    expect(submit).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText('Begrunnelse'), 'begrunnelse');

    await user.click(screen.getByRole('button', { name: /Send inn/ }));
    expect(submit).toHaveBeenCalled();

    expect(submit).toHaveBeenCalledExactlyOnceWith(
      'ANNET_RELEVANT_DOKUMENT',
      '{"meldingType":"AnnetRelevantDokumentV1","årsakerTilBehandling":["REVURDER_YRKESSKADE","SAMORDNING_OG_AVREGNING"],"begrunnelse":"begrunnelse"}',
      null
    );
  });
});
