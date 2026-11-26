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

    await user.click(nesteKnapp);

    expect(submit).toHaveBeenCalledExactlyOnceWith(
      'ANNET_RELEVANT_DOKUMENT',
      '{"meldingType":"AnnetRelevantDokumentV1","årsakerTilBehandling":["REVURDER_YRKESSKADE","REVURDER_SAMORDNING_ANDRE_FOLKETRYGDYTELSER"],"begrunnelse":""}',
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
      />
    );

    await user.selectOptions(screen.getByLabelText('Underkategori'), 'YRKESSKADE');

    await user.click(screen.getByRole('combobox', { name: /Hvilke opplysninger/ }));
    await user.click(within(screen.getByRole('listbox')).getByText(/Yrkesskade/));

    await user.click(screen.getByRole('button', { name: /Neste/ }));

    expect(submit).toHaveBeenCalledExactlyOnceWith(
      'ANNET_RELEVANT_DOKUMENT',
      '{"meldingType":"AnnetRelevantDokumentV1","årsakerTilBehandling":["REVURDER_YRKESSKADE"],"begrunnelse":"","underkategori":"YRKESSKADE"}',
      null
    );
  });

  it('at underkategori er fraværende når den ikke er valgt', async () => {
    const submit = vi.fn(() => {});

    render(
      <DigitaliserAnnetRelevantDokument
        submit={submit}
        grunnlag={grunnlag}
        readOnly={false}
        isLoading={false}
        erKravEnabled={true}
      />
    );

    // Select a category, then deselect it to get empty string
    await user.selectOptions(screen.getByLabelText('Underkategori'), 'YRKESSKADE');
    await user.selectOptions(screen.getByLabelText('Underkategori'), '');

    await user.click(screen.getByRole('combobox', { name: /Hvilke opplysninger/ }));
    await user.click(within(screen.getByRole('listbox')).getByText(/Yrkesskade/));

    await user.click(screen.getByRole('button', { name: /Neste/ }));

    expect(submit).toHaveBeenCalledExactlyOnceWith(
      'ANNET_RELEVANT_DOKUMENT',
      '{"meldingType":"AnnetRelevantDokumentV1","årsakerTilBehandling":["REVURDER_YRKESSKADE"],"begrunnelse":""}',
      null
    );
  });

  it.each([false, true])('viser lagret begrunnelse bare i lesevisning når readOnly er %s', async (readOnly) => {
    const submit = vi.fn(() => {});
    const grunnlagMedBegrunnelse: DigitaliseringsGrunnlag = {
      ...grunnlag,
      vurdering: {
        kategori: 'ANNET_RELEVANT_DOKUMENT',
        strukturertDokumentJson: JSON.stringify({
          meldingType: 'AnnetRelevantDokumentV1',
          årsakerTilBehandling: ['REVURDER_YRKESSKADE'],
          begrunnelse: 'lagret begrunnelse',
        }),
      },
    };

    render(
      <DigitaliserAnnetRelevantDokument
        submit={submit}
        grunnlag={grunnlagMedBegrunnelse}
        readOnly={readOnly}
        isLoading={false}
        erKravEnabled={true}
      />
    );

    if (readOnly) {
      const begrunnelse = screen.getByRole('textbox', { name: 'Begrunnelse' });
      expect(begrunnelse).toBeVisible();
      expect(begrunnelse).toHaveValue('lagret begrunnelse');
      expect(begrunnelse).toHaveAttribute('readonly');
      expect(screen.queryByRole('button', { name: /Neste/ })).not.toBeInTheDocument();
      expect(submit).not.toHaveBeenCalled();
    } else {
      expect(screen.queryByLabelText('Begrunnelse')).not.toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /Neste/ }));

      expect(submit).toHaveBeenCalledExactlyOnceWith(
        'ANNET_RELEVANT_DOKUMENT',
        '{"meldingType":"AnnetRelevantDokumentV1","årsakerTilBehandling":["REVURDER_YRKESSKADE"],"begrunnelse":""}',
        null
      );
    }
  });

  it.each([undefined, ''])('skjuler begrunnelsesfeltet når lagret begrunnelse er %s', (begrunnelse) => {
    render(
      <DigitaliserAnnetRelevantDokument
        submit={vi.fn()}
        grunnlag={{
          ...grunnlag,
          vurdering: {
            kategori: 'ANNET_RELEVANT_DOKUMENT',
            strukturertDokumentJson: JSON.stringify({ begrunnelse }),
          },
        }}
        readOnly
        isLoading={false}
        erKravEnabled={true}
      />
    );

    expect(screen.queryByLabelText('Begrunnelse')).not.toBeInTheDocument();
  });

  it('skjuler begrunnelse og sender tom begrunnelse med valgt metadata', async () => {
    const submit = vi.fn(() => {});

    render(
      <DigitaliserAnnetRelevantDokument
        submit={submit}
        grunnlag={grunnlag}
        readOnly={false}
        isLoading={false}
        erKravEnabled={true}
      />
    );

    expect(screen.queryByLabelText('Begrunnelse')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Underkategori'), 'YRKESSKADE');
    await user.click(screen.getByRole('combobox', { name: /Hvilke opplysninger/ }));
    await user.click(within(screen.getByRole('listbox')).getByText(/Yrkesskade/));
    await user.click(screen.getByRole('button', { name: /Neste/ }));

    expect(submit).toHaveBeenCalledExactlyOnceWith(
      'ANNET_RELEVANT_DOKUMENT',
      '{"meldingType":"AnnetRelevantDokumentV1","årsakerTilBehandling":["REVURDER_YRKESSKADE"],"begrunnelse":"","underkategori":"YRKESSKADE"}',
      null
    );
  });
});
