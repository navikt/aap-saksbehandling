import { render, screen } from '@testing-library/react';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåVedtak/ForeslåVedtak';
import { BehandlingResultat, FatteVedtakGrunnlag } from 'lib/types/types';

const grunnlag: FatteVedtakGrunnlag = {
  vurderinger: [],
};

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
    render(<ForeslåVedtak behandlingsReferanse={'123'} grunnlag={grunnlag} behandlingResultat={behandlingResultat} />);
    const overskrift = screen.getByRole('heading', { name: 'Foreslå vedtak', level: 3 });
    expect(overskrift).toBeVisible();
  });

  it('Skal ha et felt for begrunnelse', () => {
    render(<ForeslåVedtak behandlingsReferanse={'123'} grunnlag={grunnlag} behandlingResultat={behandlingResultat} />);
    const begrunnelsesFelt = screen.getByRole('textbox', { name: 'Begrunnelse' });
    expect(begrunnelsesFelt).toBeVisible();
  });

  it('Skal ha beskrivelse på feltet for begrunnelse', () => {
    render(<ForeslåVedtak behandlingsReferanse={'123'} grunnlag={grunnlag} behandlingResultat={behandlingResultat} />);
    const beskrivelse = screen.getByText('Skriv en begrunnelse');
    expect(beskrivelse).toBeVisible();
  });
});
