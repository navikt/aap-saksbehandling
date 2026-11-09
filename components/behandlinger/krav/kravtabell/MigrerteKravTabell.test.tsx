import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { MigrerteKravTabell } from 'components/behandlinger/krav/kravtabell/MigrerteKravTabell';
import { MigrertKravVurdering } from 'lib/types/types';

const migrertKrav: MigrertKravVurdering = {
  arenaSaksnummer: '123456',
  begrunnelse: 'Begrunnelse',
  muligRettFra: '2025-04-01',
  opprettet: '2025-04-01T10:30:00Z',
  referanse: '0ec524f4-68f7-4e15-81f2-47fc3bce707c',
  resterendeKvoteOrdinær: 100,
  rettighetstype: 'ORDINÆR',
  type: 'MIGRERT_KRAV',
  virkningstidspunktArena: '2025-04-01',
  vurdertAv: 'Z999999',
  vurdertIBehandling: { id: 1 },
};

const renderTabell = (vurdertAv: string) =>
  render(
    <MigrerteKravTabell
      migrertKrav={{ ...migrertKrav, vurdertAv }}
      readOnly={false}
      åpen={false}
      onToggleÅpen={() => {}}
    />
  );

describe('MigrerteKravTabell - vurdert av', () => {
  it('viser "Migrering" når vurdertAv er ArenaMigrering', () => {
    renderTabell('ArenaMigrering');
    expect(screen.getByRole('cell', { name: 'Migrering' })).toBeVisible();
  });

  it('viser "Automatisk" når vurdertAv er Kelvin', () => {
    renderTabell('Kelvin');
    expect(screen.getByRole('cell', { name: 'Automatisk' })).toBeVisible();
  });

  it('viser identen når vurdertAv er en saksbehandler', () => {
    renderTabell('Z999999');
    expect(screen.getByRole('cell', { name: 'Z999999' })).toBeVisible();
  });
});
