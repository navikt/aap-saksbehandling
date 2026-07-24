import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';
import { describe, expect, it, vi } from 'vitest';

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

    render(
      <DigitaliserAnnetRelevantDokument
        submit={submit}
        grunnlag={grunnlag}
        readOnly={false}
        isLoading={false}
        erKravEnabled={true}
        erRevurdereFrivilligeEnabled={true}
      />
    );

    const årsaker = screen.getByRole('combobox', { name: /Hvilke opplysninger/ });
    await user.click(årsaker);
    await user.click(within(screen.getByRole('listbox')).getByText(/Yrkesskade/));
    await user.click(within(screen.getByRole('listbox')).getByText(/11-28 Folketrygdytelser/));

    const list = screen.getByRole('list');
    expect(within(list).getByText(/Yrkesskade/i)).toBeVisible();
    expect(within(list).getByText(/11-28 Folketrygdytelser/i)).toBeVisible();

    const nesteKnapp = screen.getByRole('button', { name: /Neste/ });

    // Submitter før begrunnelse
    await user.click(nesteKnapp);
    expect(submit).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText('Begrunnelse'), 'begrunnelse');

    await user.click(nesteKnapp);
    expect(submit).toHaveBeenCalled();

    expect(submit).toHaveBeenCalledExactlyOnceWith(
      'ANNET_RELEVANT_DOKUMENT',
      '{"meldingType":"AnnetRelevantDokumentV1","årsakerTilBehandling":["REVURDER_YRKESSKADE","REVURDER_SAMORDNING_ANDRE_FOLKETRYGDYTELSER"],"begrunnelse":"begrunnelse"}',
      null
    );
  });

  it('at underkategori inkluderes i submit når den er valgt', async () => {
    const submit = vi.fn(() => {});

    render(
      <DigitaliserAnnetRelevantDokument
        submit={submit}
        grunnlag={grunnlag}
        readOnly={false}
        isLoading={false}
        erKravEnabled={true}
        erRevurdereFrivilligeEnabled={true}
      />
    );

    await user.selectOptions(screen.getByLabelText('Underkategori'), 'YRKESSKADE');

    await user.click(screen.getByRole('combobox', { name: /Hvilke opplysninger/ }));
    await user.click(within(screen.getByRole('listbox')).getByText(/Yrkesskade/));

    await user.type(screen.getByLabelText('Begrunnelse'), 'begrunnelse med underkategori');

    await user.click(screen.getByRole('button', { name: /Neste/ }));

    expect(submit).toHaveBeenCalledExactlyOnceWith(
      'ANNET_RELEVANT_DOKUMENT',
      '{"meldingType":"AnnetRelevantDokumentV1","årsakerTilBehandling":["REVURDER_YRKESSKADE"],"begrunnelse":"begrunnelse med underkategori","underkategori":"YRKESSKADE"}',
      null
    );
  });
});
