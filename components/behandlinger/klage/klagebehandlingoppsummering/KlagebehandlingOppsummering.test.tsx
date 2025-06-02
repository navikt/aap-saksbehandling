import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KlagebehandlingOppsummering } from 'components/behandlinger/klage/klagebehandlingoppsummering/KlagebehandlingOppsummering';
import { KlagebehandlingKontorGrunnlag, KlagebehandlingNayGrunnlag } from 'lib/types/types';

const grunnlagKontor: KlagebehandlingKontorGrunnlag = {
  vurdering: {
    begrunnelse: '',
    innstilling: 'DELVIS_OMGJØR',
    vilkårSomOmgjøres: ['FOLKETRYGDLOVEN_11_2'],
    vilkårSomOpprettholdes: ['FOLKETRYGDLOVEN_11_5'],
    vurdertAv: '',
    opprettet: '',
  },
};
const grunnlagNay: KlagebehandlingNayGrunnlag = {
  vurdering: {
    begrunnelse: '',
    innstilling: 'OMGJØR',
    vilkårSomOmgjøres: ['FOLKETRYGDLOVEN_11_20', 'FOLKETRYGDLOVEN_11_19'],
    vilkårSomOpprettholdes: [],
    vurdertAv: '',
    opprettet: '',
  },
};
describe('Klage - oppsummering', () => {
  it('Skal ha en overskrift', () => {
    render(
      <KlagebehandlingOppsummering
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
        grunnlagKontor={grunnlagKontor}
        grunnlagNay={grunnlagNay}
      />
    );

    const heading = screen.getByText('Oppsummering klagebehandlingen');
    expect(heading).toBeVisible();
  });

  it('Skal kombinere vilkår for opprettholdelse og omgjøring', () => {
    render(
      <KlagebehandlingOppsummering
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
        grunnlagKontor={grunnlagKontor}
        grunnlagNay={grunnlagNay}
      />
    );
    const innstilling = screen.getByRole('radio', { name: 'Hva er innstillingen til klagen fra NAY og Nav-kontor?' });
    expect(innstilling).toBeVisible();
    expect(innstilling).toHaveValue('Delvis omgjør');

    // expect(screen.getByRole('combobox', { name: 'Ytelsestype' })).toBeVisible();
  });
});
