import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { Vurder11_9 } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9';
import { Aktivitetsplikt11_9Grunnlag } from 'lib/types/types';

describe('Vurder11_9', () => {
  const grunnlag: Aktivitetsplikt11_9Grunnlag = {
    harTilgangTilÅSaksbehandle: true,
    vedtatteVurderinger: [
      {
        begrunnelse: 'Noe',
        dato: '2025-05-01',
        brudd: 'IKKE_MØTT_TIL_TILTAK',
        grunn: 'IKKE_RIMELIG_GRUNN',
      },
      {
        begrunnelse: 'Noe annet',
        dato: '2025-05-02',
        brudd: 'IKKE_MØTT_TIL_BEHANDLING',
        grunn: 'IKKE_RIMELIG_GRUNN',
      },
    ],
    vurderinger: [],
  };

  it('viser overskrift og tabell med tidligere vurderinger', () => {
    render(<Vurder11_9 behandlingVersjon={1} readOnly={false} grunnlag={grunnlag} />);
    expect(
      screen.getByRole('heading', { name: '§ 11-9 Reduksjon av AAP etter brudd på aktivitetsplikt' })
    ).toBeVisible();

    expect(screen.getAllByRole('row')).toHaveLength(3);
    const førsteRad = screen.getAllByRole('row')[0];
    expect(førsteRad).toHaveTextContent(/DatoBruddGrunnStatus/);

    const andreRad = screen.getAllByRole('row')[1];
    expect(andreRad).toHaveTextContent(/Vis mer01.05.2025Ikke møtt til tiltakUten rimelig grunnIverksattEndre/);

    const tredjeRad = screen.getAllByRole('row')[2];
    expect(tredjeRad).toHaveTextContent(/Vis mer02.05.2025Ikke møtt til behandlingUten rimelig grunnIverksattEndre/);
  });
});
