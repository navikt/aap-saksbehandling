import { Vilkårsoppsummering } from 'components/vilkårsoppsummering/Vilkårsoppsummering';
import { render, screen } from '@testing-library/react';
import { FlytGruppe } from 'lib/types/types';
import userEvent from '@testing-library/user-event';

const flytGruppeOppfylt: FlytGruppe = {
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
};

const flytGruppeIkkeOppfylt: FlytGruppe = {
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
            utfall: 'IKKE_OPPFYLT',
            avslagsårsak: 'MANGLENDE_DOKUMENTASJON',
            manuellVurdering: true,
          },
        ],
      },
    },
  ],
};

describe('Vilkårsoppsummering', () => {
  const user = userEvent.setup();

  it('Skal ha en overskrift', () => {
    render(<Vilkårsoppsummering flytGrupper={[flytGruppeOppfylt]} />);
    expect(screen.getByRole('button', { name: /Sykdom/ })).toBeVisible();
  });

  it('Skal ha ikon for fullført dersom alle vilkårene er oppfylt', () => {
    render(<Vilkårsoppsummering flytGrupper={[flytGruppeOppfylt]} />);
    expect(screen.getByRole('img', { name: 'gruppesteg-oppfylt' })).toBeVisible();
  });

  it('Skal vise steg når man åpner oppsummeringen', async () => {
    render(<Vilkårsoppsummering flytGrupper={[flytGruppeOppfylt]} />);
    const heading = screen.getByText('Sykdom');
    await user.click(heading);

    expect(await screen.findByText('Student')).toBeVisible();
  });

  it('Skal ha ikon for fullført dersom steget er fullført', async () => {
    render(<Vilkårsoppsummering flytGrupper={[flytGruppeOppfylt]} />);
    const heading = screen.getByText('Sykdom');
    await user.click(heading);
    expect(screen.getByRole('img', { name: 'steg-oppfylt' })).toBeVisible();
  });

  it('Skal ha ikon for avslått dersom et av vilkårene ikke er oppfylt', () => {
    render(<Vilkårsoppsummering flytGrupper={[flytGruppeIkkeOppfylt]} />);
    expect(screen.getByRole('img', { name: 'gruppesteg-avslått' })).toBeVisible();
  });

  it('Skal ha ikon for avslått dersom status på steget er "ikke oppfylt"', async () => {
    render(<Vilkårsoppsummering flytGrupper={[flytGruppeIkkeOppfylt]} />);
    const heading = screen.getByText('Sykdom');
    await user.click(heading);
    expect(screen.getByRole('img', { name: 'steg-avslått' })).toBeVisible();
  });

  it('Skal vise antall vilkår som er oppfylt', () => {
    render(<Vilkårsoppsummering flytGrupper={[flytGruppeOppfylt]} />);
    expect(screen.getByText('1 av 1 vilkår oppfylt')).toBeVisible();
  });
});
