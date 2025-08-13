import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { TidligereVurderingerV3 } from './TidligereVurderingerV3';
import { format } from 'date-fns';

const user = userEvent.setup();

const vurderinger = [
  {
    periode: {
      fom: '2025-01-01',
      tom: '2025-02-01',
    },
    erGjeldendeVurdering: false,
    vurdertAvIdent: 'AB123',
    vurdertDato: '2025-02-02',
    felter: [
      {
        label: 'Vilkår',
        value: 'Oppfylt',
      },
      {
        label: 'Begrunnelse',
        value: 'En god begrunnelse',
      },
    ],
  },
  {
    periode: {
      fom: '2025-02-02',
      tom: null,
    },
    erGjeldendeVurdering: true,
    vurdertAvIdent: 'CD456',
    vurdertDato: '2025-02-15',
    felter: [
      {
        label: 'Vilkår',
        value: 'Ikke oppfylt',
      },
      {
        label: 'Begrunnelse',
        value: 'En annen begrunnelse',
      },
    ],
  },
];

describe('TidligereVurderingerV3', () => {
  beforeEach(() => {
    render(
      <TidligereVurderingerV3
        data={vurderinger}
        buildFelter={(v) => v.felter}
        getErGjeldende={(v) => v.erGjeldendeVurdering}
        getVurdertAvIdent={(v) => v.vurdertAvIdent}
        getVurdertDato={(v) => v.vurdertDato}
        getFomDato={(v) => v.periode.fom}
      />
    );
  });

  it('kan vise tittel på kort', () => {
    expect(screen.getByRole('heading', { name: /Tidligere vurderinger/i })).toBeInTheDocument();
  });

  it('kan vise alle vurderingsperioder', () => {
    const perioder = vurderinger.map((v) => {
      const fom = format(new Date(v.periode.fom), 'dd.MM.yyyy');
      const tom = v.periode.tom ? ' ' + format(new Date(v.periode.tom), 'dd.MM.yyyy') : '';
      return `${fom} -${tom}`;
    });

    perioder.forEach((periode) => {
      expect(screen.getByText(periode)).toBeInTheDocument();
    });
  });

  it('kan oppdatere valgt vurdering', () => {
    expect(screen.getByText('Vilkår')).toBeInTheDocument();
    expect(screen.getByText('Ikke oppfylt')).toBeInTheDocument();
    expect(screen.getByText('Begrunnelse')).toBeInTheDocument();
    expect(screen.getByText('En annen begrunnelse')).toBeInTheDocument();
    expect(screen.getByText(/Vurdert av CD456, 15.02.2025/)).toBeInTheDocument();
  });

  it('Kan vise forskjellige felter i vurderingskortet', async () => {
    const secondChip = screen.getByText('01.01.2025 - 01.02.2025');
    await user.click(secondChip);

    expect(screen.getByText('Vilkår')).toBeInTheDocument();
    expect(screen.getByText('Oppfylt')).toBeInTheDocument();
    expect(screen.getByText('Begrunnelse')).toBeInTheDocument();
    expect(screen.getByText('En god begrunnelse')).toBeInTheDocument();
    expect(screen.getByText(/Vurdert av AB123, 02.02.2025/)).toBeInTheDocument();
  });

  it('kan stryke ut ikke-gjeldende vurderinger', () => {
    const struckText = screen.getByText('01.01.2025 - 01.02.2025');
    expect(struckText).toHaveStyle('text-decoration: line-through');
  });

  it('stryker ikke ut gjeldende vurdering', () => {
    const unstruckText = screen.getByText('02.02.2025 -');
    expect(unstruckText).not.toHaveStyle('text-decoration: line-through');
  });
});
