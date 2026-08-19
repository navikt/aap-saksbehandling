import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Avslag11_27KravTabell } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27KravTabell';
import { Avslag11_27Krav } from 'lib/types/types';

const krav: Avslag11_27Krav[] = [
  {
    referanse: 'ref-1',
    søknadsdokument: 'JP-001',
    type: 'RELEVANT_KRAV',
    søknadsdato: '2026-01-15',
    muligRettighetFra: '2026-02-01',
  },
  {
    referanse: 'ref-2',
    søknadsdokument: 'JP-002',
    type: 'RELEVANT_KRAV',
    søknadsdato: '2026-03-01',
    muligRettighetFra: '2026-03-15',
  },
];

describe('Avslag11_27KravTabell', () => {
  const user = userEvent.setup();

  it('viser alle krav i tabellen', () => {
    render(
      <Avslag11_27KravTabell
        label="Søknader"
        avslag11_27krav={krav}
        selectedReferanser={[]}
        onToggle={vi.fn()}
        ingenVurderingerValgtFeil={null}
        readonly={false}
        vedtatteReferanser={[]}
      />
    );

    expect(screen.getByText('JP-001')).toBeVisible();
    expect(screen.getByText('JP-002')).toBeVisible();
  });

  it('viser kravtype som leselig tekst', () => {
    render(
      <Avslag11_27KravTabell
        label="Søknader"
        avslag11_27krav={krav}
        selectedReferanser={[]}
        onToggle={vi.fn()}
        ingenVurderingerValgtFeil={null}
        readonly={false}
        vedtatteReferanser={[]}
      />
    );

    const kravTypeRader = screen.getAllByText('Nytt krav om AAP');
    expect(kravTypeRader).toHaveLength(2);
  });

  it('checkbox er checked for selectedReferanser', () => {
    render(
      <Avslag11_27KravTabell
        label="Søknader"
        avslag11_27krav={krav}
        selectedReferanser={['ref-1']}
        onToggle={vi.fn()}
        ingenVurderingerValgtFeil={null}
        readonly={false}
        vedtatteReferanser={[]}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('kaller onToggle med riktig referanse ved klikk', async () => {
    const onToggle = vi.fn();
    render(
      <Avslag11_27KravTabell
        label="Søknader"
        avslag11_27krav={krav}
        selectedReferanser={[]}
        onToggle={onToggle}
        ingenVurderingerValgtFeil={null}
        readonly={false}
        vedtatteReferanser={[]}
      />
    );

    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(onToggle).toHaveBeenCalledWith('ref-1');
  });

  it('checkbox for vedtatt referanse kan ikke endres ved klikk', async () => {
    const onToggle = vi.fn();
    render(
      <Avslag11_27KravTabell
        label="Søknader"
        avslag11_27krav={krav}
        selectedReferanser={['ref-1']}
        onToggle={onToggle}
        ingenVurderingerValgtFeil={null}
        readonly={false}
        vedtatteReferanser={['ref-1']}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('viser feilmelding når ingenVurderingerValgtFeil er satt', () => {
    render(
      <Avslag11_27KravTabell
        label="Søknader"
        avslag11_27krav={krav}
        selectedReferanser={[]}
        onToggle={vi.fn()}
        ingenVurderingerValgtFeil="Du må velge minst ett krav å vurdere."
        readonly={false}
        vedtatteReferanser={[]}
      />
    );

    expect(screen.getByText('Du må velge minst ett krav å vurdere.')).toBeVisible();
  });

  it('viser ikke feilmelding når ingenVurderingerValgtFeil er null', () => {
    render(
      <Avslag11_27KravTabell
        label="Søknader"
        avslag11_27krav={krav}
        selectedReferanser={[]}
        onToggle={vi.fn()}
        ingenVurderingerValgtFeil={null}
        readonly={false}
        vedtatteReferanser={[]}
      />
    );

    expect(screen.queryByText('Du må velge minst ett krav å vurdere.')).not.toBeInTheDocument();
  });

  it('viser tom tabell når kravliste er tom', () => {
    render(
      <Avslag11_27KravTabell
        label="Søknader"
        avslag11_27krav={[]}
        selectedReferanser={[]}
        onToggle={vi.fn()}
        ingenVurderingerValgtFeil={null}
        readonly={false}
        vedtatteReferanser={[]}
      />
    );

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
