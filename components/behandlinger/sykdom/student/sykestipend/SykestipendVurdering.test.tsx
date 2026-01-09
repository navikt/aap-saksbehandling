import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { SykestipendVurdering } from './SykestipendVurdering';
import { MellomlagretVurdering, SykestipendGrunnlag } from 'lib/types/types';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const grunnlagMedVurdering: SykestipendGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  historiskeVurderinger: [],
  gjeldendeVurdering: {
    begrunnelse: 'Test-begrunnelse',
    perioder: [{ fom: '01.01.2024', tom: '31.01.2024' }],
    vurdertAv: {
      dato: '2024-02-01',
      ident: 'Saksbehandler',
    },
  },
};

const mellomlagretVurdering: MellomlagretVurdering = {
  avklaringsbehovkode: '5034',
  behandlingId: { id: 1 },
  data: JSON.stringify({
    begrunnelse: 'Mellomlagret begrunnelse',
    perioder: [{ fom: '02.02.2024', tom: '28.02.2024' }],
  }),
  vurdertDato: '2024-02-02T12:00:00.000',
  vurdertAv: 'Test-bruker',
};

describe('SykestipendVurdering', () => {
  beforeEach(() => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'SAMORDNING_SYKESTIPEND' });
  });

  it('viser overskrift', () => {
    render(<SykestipendVurdering grunnlag={grunnlagMedVurdering} behandlingVersjon={0} readOnly={false} />);
    expect(screen.getByText('§ 11-29 Sykestipend fra lånekassen')).toBeVisible();
  });

  it('viser begrunnelsesfelt med defaultverdi fra vurdering', () => {
    render(<SykestipendVurdering grunnlag={grunnlagMedVurdering} behandlingVersjon={0} readOnly={false} />);
    expect(screen.getByRole('textbox', { name: /sykestipend/i })).toHaveValue('Test-begrunnelse');
  });

  it('viser perioder fra vurdering', () => {
    render(<SykestipendVurdering grunnlag={grunnlagMedVurdering} behandlingVersjon={0} readOnly={false} />);
    expect(screen.getByDisplayValue('01.01.2024')).toBeVisible();
    expect(screen.getByDisplayValue('31.01.2024')).toBeVisible();
  });

  it('bruker mellomlagret vurdering som default dersom den eksisterer', () => {
    render(
      <SykestipendVurdering
        grunnlag={grunnlagMedVurdering}
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagretVurdering}
      />
    );
    expect(screen.getByRole('textbox', { name: /sykestipend/i })).toHaveValue('Mellomlagret begrunnelse');
    expect(screen.getByDisplayValue('02.02.2024')).toBeVisible();
    expect(screen.getByDisplayValue('28.02.2024')).toBeVisible();
  });

  it('deaktiverer legg til- og slett-knapper ved readOnly true', () => {
    render(<SykestipendVurdering grunnlag={grunnlagMedVurdering} behandlingVersjon={0} readOnly={true} />);
    expect(screen.getByRole('button', { name: /legg til/i })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: /slett/i })[0]).toBeDisabled();
  });

  it('aktiverer legg til- og slett-knapper ved readOnly false', () => {
    render(<SykestipendVurdering grunnlag={grunnlagMedVurdering} behandlingVersjon={0} readOnly={false} />);
    expect(screen.getByRole('button', { name: /legg til/i })).toBeEnabled();
    expect(screen.getAllByRole('button', { name: /slett/i })[0]).toBeEnabled();
  });

  it('viser vurdertAv', () => {
    render(<SykestipendVurdering grunnlag={grunnlagMedVurdering} behandlingVersjon={0} readOnly={true} />);
    expect(screen.getByText('Vurdert av Saksbehandler, 01.02.2024')).toBeVisible();
  });
});
