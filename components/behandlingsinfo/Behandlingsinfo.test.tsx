import { describe, expect, it } from 'vitest';
import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { render, screen } from '@testing-library/react';
import { DetaljertBehandling, SaksInfo } from 'lib/types/types';

const behandling: DetaljertBehandling = {
  type: 'Førstegangsbehandling',
  status: 'UTREDES',
  opprettet: '12.12.2024',
  skalForberede: false,
  aktivtSteg: 'START_BEHANDLING',
  avklaringsbehov: [],
  referanse: '1234',
  versjon: 1,
  vilkår: [],
  virkningstidspunkt: '2025-02-11',
};

const sak: SaksInfo = {
  behandlinger: [],
  ident: '12345678901',
  periode: { fom: '2025-01-31', tom: '2026-01-31' },
  status: 'UTREDES',
  saksnummer: 'ERT2E',
  opprettetTidspunkt: '2025-04-25T07:44:27.789298',
};

describe('Behandlingsinfo', () => {
  it('Skal ha overskrift for riktig behandlingstype', () => {
    render(<Behandlingsinfo behandling={behandling} sak={sak} />);
    expect(screen.getByText('Førstegangsbehandling')).toBeVisible();
  });

  it('Skal vise korrekt behandlingsstatus dersom status er utredes ', () => {
    render(<Behandlingsinfo behandling={behandling} sak={sak} />);
    expect(screen.getByText('Utredes')).toBeVisible();
  });

  it('skal ha en tag for behandlingsstatus', () => {
    render(<Behandlingsinfo behandling={behandling} sak={sak} />);
    const tag = screen.getByText('Utredes');
    expect(tag).toBeVisible();
  });

  it('Skal vise korrekt behandlingsstatus dersom status er avsluttet ', () => {
    render(<Behandlingsinfo behandling={{ ...behandling, status: 'AVSLUTTET' }} sak={sak} />);
    expect(screen.getByText('Avsluttet')).toBeVisible();
  });

  it('Skal vise korrekt behandlingsstatus dersom status er opprettet ', () => {
    render(<Behandlingsinfo behandling={{ ...behandling, status: 'OPPRETTET' }} sak={sak} />);
    expect(screen.getByText('Opprettet')).toBeVisible();
  });

  it('skal ha en label for opprettelsesdato', () => {
    render(<Behandlingsinfo behandling={behandling} sak={sak} />);
    const label = screen.getByText('Opprettet:');
    expect(label).toBeVisible();
  });

  it('Skal vise dato for opprettet dato', () => {
    render(<Behandlingsinfo behandling={behandling} sak={sak} />);
    expect(screen.getByText('12.12.2024')).toBeVisible();
  });

  it('Skal vise dato for virkninsgstidspunkt', () => {
    render(<Behandlingsinfo behandling={behandling} sak={sak} />);
    expect(screen.getByText('11.02.2025')).toBeVisible();
  });

  it('Skal vise dato for rettighetsperiode dersom virkningstidspunkt ikke er satt', () => {
    render(<Behandlingsinfo behandling={{ ...behandling, virkningstidspunkt: null }} sak={sak} />);
    expect(screen.getByText('31.01.2025')).toBeVisible();
  });

  it('Skal vise label med forventet virkningstidspunkt dersom det ikke er satt', () => {
    render(<Behandlingsinfo behandling={{ ...behandling, virkningstidspunkt: null }} sak={sak} />);
    expect(screen.getByText('Virkningstidspunkt (foreløpig):')).toBeVisible();
  });

  it('skal ha en label for saksnummer', () => {
    render(<Behandlingsinfo behandling={behandling} sak={sak} />);
    const label = screen.getByText('Saksnummer:');
    expect(label).toBeVisible();
  });

  it('Skal vise saksnummer', () => {
    render(<Behandlingsinfo behandling={behandling} sak={sak} />);
    expect(screen.getByText('ERT2E')).toBeVisible();
  });
});
