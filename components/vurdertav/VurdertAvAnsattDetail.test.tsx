import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VurdertAvAnsattDetail } from 'components/vurdertav/VurdertAvAnsattDetail';
import { VurdertAvAnsatt } from 'lib/types/types';

const saksbehandler: VurdertAvAnsatt = {
  ident: 'Z999999',
  ansattnavn: 'Jan T. Loven',
  dato: '2025-08-21',
  kilde: 'SAKSBEHANDLER',
};

const automatisk: VurdertAvAnsatt = {
  ident: 'Kelvin',
  dato: '2025-08-21',
  kilde: 'AUTOMATISK',
};

const migrertFraArena: VurdertAvAnsatt = {
  ident: 'ArenaMigrering',
  dato: '2025-08-21',
  kilde: 'MIGRERT_FRA_ARENA',
};

describe('VurdertAvAnsattDetail', () => {
  it('viser ingenting når vurdertAv er undefined', () => {
    const { container } = render(<VurdertAvAnsattDetail vurdertAv={undefined} variant={'VURDERING'} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('viser "Vurdert automatisk" når kilde er AUTOMATISK, uavhengig av variant', () => {
    render(<VurdertAvAnsattDetail vurdertAv={automatisk} variant={'KVALITETSSIKRER'} />);

    expect(screen.getByText('Vurdert automatisk, 21.08.2025')).toBeVisible();
  });

  it('viser "Migrert fra Arena" når kilde er MIGRERT_FRA_ARENA, uavhengig av variant', () => {
    render(<VurdertAvAnsattDetail vurdertAv={migrertFraArena} variant={'BESLUTTER'} />);

    expect(screen.getByText('Migrert fra Arena, 21.08.2025')).toBeVisible();
  });

  it('viser "Vurdert av" for variant VURDERING når kilde er SAKSBEHANDLER', () => {
    render(<VurdertAvAnsattDetail vurdertAv={saksbehandler} variant={'VURDERING'} />);

    expect(screen.getByText('Vurdert av Jan T. Loven, 21.08.2025')).toBeVisible();
  });

  it('viser "Kvalitetssikret av" for variant KVALITETSSIKRER når kilde er SAKSBEHANDLER', () => {
    render(<VurdertAvAnsattDetail vurdertAv={saksbehandler} variant={'KVALITETSSIKRER'} />);

    expect(screen.getByText('Kvalitetssikret av Jan T. Loven, 21.08.2025')).toBeVisible();
  });

  it('viser "Returnert av" for variant KVALITETSSIKRER når erRetur er true', () => {
    render(<VurdertAvAnsattDetail vurdertAv={{ ...saksbehandler, erRetur: true }} variant={'KVALITETSSIKRER'} />);

    expect(screen.getByText('Returnert av Jan T. Loven, 21.08.2025')).toBeVisible();
  });

  it('viser "Besluttet av" for variant BESLUTTER når kilde er SAKSBEHANDLER', () => {
    render(<VurdertAvAnsattDetail vurdertAv={saksbehandler} variant={'BESLUTTER'} />);

    expect(screen.getByText('Besluttet av Jan T. Loven, 21.08.2025')).toBeVisible();
  });

  it('viser "Returnert av" for variant BESLUTTER når erRetur er true', () => {
    render(<VurdertAvAnsattDetail vurdertAv={{ ...saksbehandler, erRetur: true }} variant={'BESLUTTER'} />);

    expect(screen.getByText('Returnert av Jan T. Loven, 21.08.2025')).toBeVisible();
  });

  it('viser "Trukket av" for variant TRUKKET når kilde er SAKSBEHANDLER', () => {
    render(<VurdertAvAnsattDetail vurdertAv={saksbehandler} variant={'TRUKKET'} />);

    expect(screen.getByText('Trukket av Jan T. Loven, 21.08.2025')).toBeVisible();
  });

  it('bruker ident som visningsnavn når ansattnavn mangler', () => {
    render(<VurdertAvAnsattDetail vurdertAv={{ ...saksbehandler, ansattnavn: undefined }} variant={'VURDERING'} />);

    expect(screen.getByText('Vurdert av Z999999, 21.08.2025')).toBeVisible();
  });
});
