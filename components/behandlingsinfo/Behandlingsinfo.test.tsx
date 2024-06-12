import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { render, screen } from '@testing-library/react';
import { formaterDatoForFrontend } from 'lib/utils/date';

describe('Behandlingsinfo', () => {
  beforeEach(() => {
    render(
      <Behandlingsinfo
        behandling={{
          type: 'Førstegangsbehandling',
          status: 'UTREDES',
          opprettet: '12.12.2024',
          aktivtSteg: 'START_BEHANDLING',
          avklaringsbehov: [],
          referanse: '1234',
          versjon: 1,
          vilkår: [],
        }}
      />
    );
  });
  it('Skal ha overskrift for riktig behandlingstype', () => {
    expect(screen.getByText('Førstegangsbehandling')).toBeVisible();
  });

  it('Skal vise behandlingsstatus', () => {
    expect(screen.getByText('UTREDES')).toBeVisible();
  });

  it('Skal vise dato og klokkeslett for opprettet dato', () => {
    expect(screen.getByText(formaterDatoForFrontend('12.12.2024'))).toBeVisible();
  });
});
