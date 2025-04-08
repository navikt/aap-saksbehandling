import { describe, expect, it } from 'vitest';
import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { render, screen } from '@testing-library/react';
import { DetaljertBehandling } from 'lib/types/types';

const behandling: DetaljertBehandling = {
  type: 'Førstegangsbehandling',
  status: 'UTREDES',
  opprettet: '12.12.2024',
  skalForberede: false,
  aktivtSteg: 'START_BEHANDLING',
  avklaringsbehov: [],
  referanse: '1234',
  versjon: 1,
  virkningstidspunkt: '13.12.2024',
  vilkår: [],
};

describe('Behandlingsinfo', () => {
  it('Skal ha overskrift for riktig behandlingstype', () => {
    render(<Behandlingsinfo behandling={behandling} saksnummer={'ERT2E'} />);
    expect(screen.getByText('Førstegangsbehandling')).toBeVisible();
  });

  it('Skal vise korrekt behandlingsstatus dersom status er utredes ', () => {
    render(<Behandlingsinfo behandling={behandling} saksnummer={'ERT2E'} />);
    expect(screen.getByText('Utredes')).toBeVisible();
  });

  it('skal ha en tag for behandlingsstatus', () => {
    render(<Behandlingsinfo behandling={behandling} saksnummer={'ERT2E'} />);
    const tag = screen.getByText('Utredes');
    expect(tag).toBeVisible();
  });

  it('Skal vise korrekt behandlingsstatus dersom status er avsluttet ', () => {
    render(<Behandlingsinfo behandling={{ ...behandling, status: 'AVSLUTTET' }} saksnummer={'ERT2E'} />);
    expect(screen.getByText('Avsluttet')).toBeVisible();
  });

  it('Skal vise korrekt behandlingsstatus dersom status er opprettet ', () => {
    render(<Behandlingsinfo behandling={{ ...behandling, status: 'OPPRETTET' }} saksnummer={'ERT2E'} />);
    expect(screen.getByText('Opprettet')).toBeVisible();
  });

  it('skal ha en label for opprettelsesdato', () => {
    render(<Behandlingsinfo behandling={behandling} saksnummer={'ERT2E'} />);
    const label = screen.getByText('Opprettet:');
    expect(label).toBeVisible();
  });

  it('Skal vise dato for opprettet dato', () => {
    render(<Behandlingsinfo behandling={behandling} saksnummer={'ERT2E'} />);
    expect(screen.getByText('12.12.2024')).toBeVisible();
  });

  it('Skal vise dato for virkninsgstidspunkt', () => {
    render(<Behandlingsinfo behandling={behandling} saksnummer={'ERT2E'} />);
    expect(screen.getByText('13.12.2024')).toBeVisible();
  });

  it('skal ha en label for saksnummer', () => {
    render(<Behandlingsinfo behandling={behandling} saksnummer={'ERT2E'} />);
    const label = screen.getByText('Saksnummer:');
    expect(label).toBeVisible();
  });

  it('Skal vise saksnummer', () => {
    render(<Behandlingsinfo behandling={behandling} saksnummer={'ERT2E'} />);
    expect(screen.getByText('ERT2E')).toBeVisible();
  });
});
