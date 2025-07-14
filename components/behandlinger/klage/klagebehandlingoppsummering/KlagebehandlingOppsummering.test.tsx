import { describe, expect, it } from 'vitest';
import { screen, render } from '../../../../lib/test/CustomRender';
import { KlagebehandlingOppsummering } from 'components/behandlinger/klage/klagebehandlingoppsummering/KlagebehandlingOppsummering';
import { KlagebehandlingKontorGrunnlag, KlagebehandlingNayGrunnlag } from 'lib/types/types';

const grunnlagKontor: KlagebehandlingKontorGrunnlag = {
  vurdering: {
    begrunnelse: '',
    innstilling: 'DELVIS_OMGJØR',
    vilkårSomOmgjøres: ['FOLKETRYGDLOVEN_11_2'],
    vilkårSomOpprettholdes: ['FOLKETRYGDLOVEN_11_5'],
    vurdertAv: {
      ident: 'ident',
      dato: '2025-01-01',
      ansattnavn: 'Ine',
      enhetsnavn: 'Kontor',
    },
  },
};
const grunnlagNay: KlagebehandlingNayGrunnlag = {
  vurdering: {
    begrunnelse: '',
    innstilling: 'OMGJØR',
    vilkårSomOmgjøres: ['FOLKETRYGDLOVEN_11_20', 'FOLKETRYGDLOVEN_11_19'],
    vilkårSomOpprettholdes: [],
    vurdertAv: {
      ident: 'ident',
      dato: '2025-01-01',
      ansattnavn: 'Ine',
      enhetsnavn: 'Kontor',
    },
  },
};
describe('Klage - oppsummering', () => {
  it('Skal ha en overskrift', () => {
    render(
      <KlagebehandlingOppsummering
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
        grunnlagKontor={grunnlagKontor}
        grunnlagNay={grunnlagNay}
      />
    );

    const heading = screen.getByText('Oppsummering av klagebehandlingen');
    expect(heading).toBeVisible();
  });

  it('Skal kombinere vilkår for opprettholdelse og omgjøring', () => {
    render(
      <KlagebehandlingOppsummering
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
        grunnlagKontor={grunnlagKontor}
        grunnlagNay={grunnlagNay}
      />
    );
    const innstilling = screen.getByText('Delvis omgjøring');
    expect(innstilling).toBeVisible();

    const omgjøres = screen.getByText('§ 11-2');
    expect(omgjøres).toBeVisible();

    const opprettholdes_11_5 = screen.getByText('§ 11-5');
    expect(opprettholdes_11_5).toBeVisible();
    const opprettholdes_11_20 = screen.getByText('§ 11-20');
    expect(opprettholdes_11_20).toBeVisible();
    const opprettholdes_11_19 = screen.getByText('§ 11-19');
    expect(opprettholdes_11_19).toBeVisible();
  });
});
