import { render, screen } from '@testing-library/react';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåVedtak/ForeslåVedtak';
import { FatteVedtakGrunnlag, FlytGruppe } from 'lib/types/types';

const grunnlag: FatteVedtakGrunnlag = {
  vurderinger: [],
};

const flytGruppeOppfylt: FlytGruppe[] = [
  {
    stegGruppe: 'SYKDOM',
    erFullført: true,
    steg: [
      {
        stegType: 'AVKLAR_STUDENT',
        avklaringsbehov: [
          {
            // @ts-ignore
            definisjon: `AVKLAR_STUDENT(kode=${5006})`,
            status: 'AVSLUTTET',
            endringer: [],
          },
        ],
        vilkårDTO: {
          vilkårtype: 'SYKDOMSVILKÅRET',
          perioder: [
            {
              periode: { fom: '20.02.2023', tom: '21.02.2023' },
              begrunnelse: 'hello pello',
              utfall: 'OPPFYLT',
              avslagsårsak: 'MANGLENDE_DOKUMENTASJON',
              manuellVurdering: true,
            },
          ],
        },
      },
    ],
  },
];

describe('ForeslåVedtak', () => {
  it('Skal ha en overskrift', () => {
    render(<ForeslåVedtak behandlingsReferanse={'123'} grunnlag={grunnlag} flytGrupper={flytGruppeOppfylt} />);
    const overskrift = screen.getByRole('heading', { name: 'Foreslå vedtak', level: 3 });
    expect(overskrift).toBeVisible();
  });

  it('Skal ha et felt for begrunnelse', () => {
    render(<ForeslåVedtak behandlingsReferanse={'123'} grunnlag={grunnlag} flytGrupper={flytGruppeOppfylt} />);
    const begrunnelsesFelt = screen.getByRole('textbox', { name: 'Begrunnelse' });
    expect(begrunnelsesFelt).toBeVisible();
  });

  it('Skal ha beskrivelse på feltet for begrunnelse', () => {
    render(<ForeslåVedtak behandlingsReferanse={'123'} grunnlag={grunnlag} flytGrupper={flytGruppeOppfylt} />);
    const beskrivelse = screen.getByText('Skriv en begrunnelse');
    expect(beskrivelse).toBeVisible();
  });
});
