import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { render, screen } from '@testing-library/react';
import { DetaljertBehandling } from 'lib/types/types';

const behandling: DetaljertBehandling = {
  type: 'Førstegangsbehandling',
  status: 'UTREDES',
  opprettet: '12.12.2024',
  aktivtSteg: 'START_BEHANDLING',
  avklaringsbehov: [],
  referanse: '1234',
  versjon: 1,
  vilkår: [],
};

describe('Behandlingsinfo', () => {
  it('Skal ha overskrift for riktig behandlingstype', () => {
    render(<Behandlingsinfo behandling={behandling} />);
    expect(screen.getByText('Førstegangsbehandling')).toBeVisible();
  });

  it('Skal vise korrekt behandlingsstatus dersom status er utredes ', () => {
    render(<Behandlingsinfo behandling={behandling} />);
    expect(screen.getByText('Utredes')).toBeVisible();
  });

  it('skal ha en label for behandlingsstatus', () => {
    render(<Behandlingsinfo behandling={behandling} />);
    const label = screen.getByText('Behandlingsstatus:');
    expect(label).toBeVisible();
  });

  it('Skal vise korrekt behandlingsstatus dersom status er avsluttet ', () => {
    render(<Behandlingsinfo behandling={{ ...behandling, status: 'AVSLUTTET' }} />);
    expect(screen.getByText('Avsluttet')).toBeVisible();
  });

  it('Skal vise korrekt behandlingsstatus dersom status er opprettet ', () => {
    render(<Behandlingsinfo behandling={{ ...behandling, status: 'OPPRETTET' }} />);
    expect(screen.getByText('Opprettet')).toBeVisible();
  });

  it('skal ha en label for opprettelsesdato', () => {
    render(<Behandlingsinfo behandling={behandling} />);
    const label = screen.getByText('Opprettet:');
    expect(label).toBeVisible();
  });

  it('Skal vise dato for opprettet dato', () => {
    render(<Behandlingsinfo behandling={behandling} />);
    expect(screen.getByText('12.12.2024')).toBeVisible();
  });
});
