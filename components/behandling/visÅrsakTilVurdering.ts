import { DetaljertBehandling } from 'lib/types/types';

export function visÅrsakTilVurdering(behandling: DetaljertBehandling): boolean {
  if (behandling.type != 'Førstegangsbehandling') {
    return true;
  }

  const noenMedBegrunnelse = behandling.vurderingsbehovOgÅrsaker.some((årsak) => !!årsak.beskrivelse);
  return noenMedBegrunnelse;
}
