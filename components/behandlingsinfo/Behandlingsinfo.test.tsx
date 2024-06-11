import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { render, screen } from '@testing-library/react';
import { formaterDatoForFrontend } from 'lib/utils/date';

describe('Behandlingsinfo', () => {
  beforeEach(() => {
    render(<Behandlingsinfo behandlingstype="Førstegangsbehandling" status={'Utredes'} opprettet={new Date()} />);
  });
  it('Skal ha overskrift for riktig behandlingstype', () => {
    expect(screen.getByText('Førstegangsbehandling')).toBeVisible();
  });

  it('Skal vise behandlingsstatus', () => {
    expect(screen.getByText('Utredes')).toBeVisible();
  });

  it('Skal vise dato og klokkeslett for opprettet dato', () => {
    expect(screen.getByText(formaterDatoForFrontend(new Date()))).toBeVisible();
  });
});
