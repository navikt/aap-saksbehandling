import { render, screen } from '@testing-library/react';
import { BehandlingFlytOgTilstand, FlytGruppe } from 'lib/types/postmottakTypes';
import { describe, expect, it } from 'vitest';
import { StegGruppeIndikatorAksel } from './StegGruppeIndikatorAksel';

describe('StegGruppeIndikatorAksel', () => {
  it('viser steggruppen for bruker under 18 år', () => {
    const gruppe: FlytGruppe = { stegGruppe: 'UNDER18', skalVises: true, erFullført: false, steg: [] };
    const flyt: BehandlingFlytOgTilstand = {
      aktivGruppe: 'UNDER18',
      aktivtSteg: 'AVKLAR_UNDER18',
      behandlingVersjon: 1,
      flyt: [gruppe],
      prosessering: { status: 'FERDIG', ventendeOppgaver: [] },
      visning: { readOnly: false, typeBehandling: 'Under18', visVentekort: false },
    };

    render(<StegGruppeIndikatorAksel behandlingsreferanse="123" stegGrupper={[gruppe]} flytRespons={flyt} />);

    expect(screen.getByRole('link', { name: 'Under 18 år' })).toHaveAttribute('href', '/postmottak/123/UNDER18');
  });
});
