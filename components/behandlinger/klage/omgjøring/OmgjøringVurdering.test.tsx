import { describe, expect, it } from 'vitest';
import { screen, render } from '../../../../lib/test/CustomRender';
import { OmgjøringVurdering } from 'components/behandlinger/klage/omgjøring/OmgjøringVurdering';

describe('Klage - omgjøring', () => {
  it('Skal ha en overskrift', () => {
    render(
      <OmgjøringVurdering
        klageresultat={{
          vilkårSomSkalOmgjøres: ['FOLKETRYGDLOVEN_11_5'],
        }}
        sak={{
          saksnummer: 'uuid-1',
          behandlinger: [
            {
              referanse: 'uuid-2',
              opprettet: '2023-10-01T12:00:00Z',
              type: 'Førstegangsbehandling',
              status: 'AVSLUTTET',
              årsaker: ['MOTTATT_SØKNAD'],
            },
          ],
          ident: 'ident',
          opprettetTidspunkt: '2023-10-01T12:00:00Z',
          status: 'AVSLUTTET',
          periode: {
            fom: '2023-10-01',
            tom: '2023-10-31',
          },
        }}
      />
    );

    const heading = screen.getByText('Omgjøring');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for tekstlig beskrivelse av årsaken til revurdering', () => {
    render(
      <OmgjøringVurdering
        klageresultat={{
          vilkårSomSkalOmgjøres: ['FOLKETRYGDLOVEN_11_5'],
        }}
        sak={{
          saksnummer: 'uuid-1',
          behandlinger: [
            {
              referanse: 'uuid-2',
              opprettet: '2023-10-01T12:00:00Z',
              type: 'Førstegangsbehandling',
              status: 'AVSLUTTET',
              årsaker: ['MOTTATT_SØKNAD'],
            },
          ],
          ident: 'ident',
          opprettetTidspunkt: '2023-10-01T12:00:00Z',
          status: 'AVSLUTTET',
          periode: {
            fom: '2023-10-01',
            tom: '2023-10-31',
          },
        }}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Hva er årsaken?' });
    expect(begrunnelse).toBeVisible();
    expect(begrunnelse).toHaveValue('Revurdering etter klage som tas til følge. Følgende vilkår omgjøres: § 11-5');
  });
});
