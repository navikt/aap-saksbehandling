import { describe, it, expect } from 'vitest';
import { Vilkårsoppsummering } from 'components/vilkårsoppsummering/Vilkårsoppsummering';
import { render, screen } from '@testing-library/react';
import { BehandlingResultat } from 'lib/types/types';

const behandlingResultatOppfylt: BehandlingResultat = {
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

const behandlingResultatIkkeOppfylt: BehandlingResultat = {
  vilkårene: [
    {
      vilkårtype: 'SYKDOMSVILKÅRET',
      perioder: [
        {
          periode: {
            fom: '2021-03-14',
            tom: '2027-03-14',
          },
          utfall: 'IKKE_OPPFYLT',
          manuellVurdering: false,
          avslagsårsak: 'IKKE_SYKDOM_SKADE_LYTE_VESENTLIGDEL',
        },
      ],
    },
  ],
};

describe('Vilkårsoppsummering', () => {
  it('Skal vise korrekt navn på vilkåret', () => {
    render(<Vilkårsoppsummering behandlingResultat={behandlingResultatOppfylt} />);
    expect(screen.getByText(/Sykdom/)).toBeVisible();
  });

  it('Skal ha ikon for fullført dersom alle vilkårene er oppfylt', () => {
    render(<Vilkårsoppsummering behandlingResultat={behandlingResultatOppfylt} />);
    expect(screen.getByRole('img', { name: 'vilkår-oppfylt' })).toBeVisible();
  });

  it('Skal ha ikon for avslått dersom et av vilkårene ikke er oppfylt', () => {
    render(<Vilkårsoppsummering behandlingResultat={behandlingResultatIkkeOppfylt} />);
    expect(screen.getByRole('img', { name: 'vilkår-avslått' })).toBeVisible();
  });

  it('Skal vise antall vilkår som er oppfylt', () => {
    render(<Vilkårsoppsummering behandlingResultat={behandlingResultatOppfylt} />);
    expect(screen.getByText('1 av 1 vilkår oppfylt')).toBeVisible();
  });
});
