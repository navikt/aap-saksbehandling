import { render, screen } from '@testing-library/react';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtak';
import { BehandlingResultat } from 'lib/types/types';

const behandlingResultat: BehandlingResultat = {
  vilkårene: [
    {
      vilkårtype: 'SYKDOMSVILKÅRET',
      perioder: [
        {
          periode: {
            fom: '2021-03-14',
            tom: '2027-03-14',
          },
          utfall: 'OPPFYLT',
          manuellVurdering: false,
          avslagsårsak: 'IKKE_SYKDOM_SKADE_LYTE_VESENTLIGDEL',
        },
      ],
    },
  ],
};

describe('ForeslåVedtak', () => {
  it('Skal ha en overskrift', () => {
    render(<ForeslåVedtak behandlingsReferanse={'123'} behandlingResultat={behandlingResultat} />);
    const overskrift = screen.getByRole('heading', { name: 'Foreslå vedtak', level: 3 });
    expect(overskrift).toBeVisible();
  });
});
